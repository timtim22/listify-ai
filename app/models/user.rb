class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable

  has_many :legacy_task_runs, class_name: "Legacy::TaskRun"
  has_many :task_runs, dependent: :destroy
  has_many :task_run_feedbacks, dependent: :destroy
  has_many :inputs, dependent: :destroy
  has_many :full_listings, dependent: :destroy
  has_many :recorded_searches, dependent: :destroy

  has_many :subscriptions
  has_many :charges

  attr_accessor :early_access_code
  validates :early_access_code, inclusion: { in: ['MIN39210'] }, on: :create

  def name
    "#{first_name} #{last_name}"
  end

  def on_private_beta?
    self.created_at < Date.new(2022, 01, 16) && never_had_subscription?
  end

  def on_trial?
    self.created_at > 14.days.ago.beginning_of_day && never_had_subscription?
  end

  def trial_end_date
    on_trial? && (self.created_at + 14.days).to_date
  end

  def subscription_status
    if subscribed?
      subscription.plan.name
    elsif on_trial?
      "on_trial"
    elsif on_private_beta?
      "on_private_beta"
    else
      "unknown"
    end
  end

  def runs_remaining_today
    SpinCounter.new(self).spins_remaining
  end

  def never_had_subscription?
    subscription.nil? ||
    subscriptions.all? { |s| s.status.downcase == "incomplete" }
  end

  def subscribed?
    subscription && subscription.active?
  end

  def subscription
    subscriptions.order(:created_at).last
  end

  def subscribe(plan, options={})
    stripe_customer if !stripe_id
    args = {
      customer: stripe_id,
      items: [{ price: plan }],
      expand: ['latest_invoice.payment_intent'],
      off_session: true
    }.merge(options)
    args[:trial_from_plan] = true if !args[:trial_period_days]

    sub = Stripe::Subscription.create(args)
    subscription = subscriptions.create(
      stripe_id: sub.id,
      stripe_plan: plan,
      status: sub.status,
      trial_ends_at: (sub.trial_end ? Time.at(sub.trial_end) : nil),
      ends_at: nil
    )

    if sub.status == "incomplete" && ["requires_action", "requires_payment_method"].include?(sub.latest_invoice.payment_intent.status)
      raise PaymentIncomplete.new(sub.latest_invoice.payment_intent), "Subscription requires authentication"
    end

    UserMailer.subscription_activated(self).deliver_later
    subscription
  end

  def create_setup_intent
    stripe_customer if !stripe_id
    Stripe::SetupIntent.create(customer: stripe_id)
  end

  def update_card(payment_method_id)
    stripe_customer if !stripe_id
    payment_method = Stripe::PaymentMethod.attach(
      payment_method_id,
      { customer: stripe_id }
    )
    Stripe::Customer.update(
      stripe_id,
      invoice_settings: { default_payment_method: payment_method.id }
    )
    update(
      card_brand: payment_method.card.brand.titleize,
      card_last4: payment_method.card.last4,
      card_exp_month: payment_method.card.exp_month,
      card_exp_year: payment_method.card.exp_year
    )
  end

  def stripe_customer
    if stripe_id
      Stripe::Customer.retrieve(stripe_id)
    else
      customer = Stripe::Customer.create(
        email: email,
        name: "#{first_name} #{last_name}"
      )
      update(stripe_id: customer.id)
      customer
    end
  end
end
