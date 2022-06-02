class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable, :masqueradable

  has_one :team_role, required: false, dependent: :destroy
  has_one :team, through: :team_role

  has_many :legacy_task_runs, class_name: 'Legacy::TaskRun', dependent: :destroy
  has_many :task_runs, dependent: :destroy
  has_many :task_results, through: :task_runs
  has_many :inputs, dependent: :destroy
  has_many :full_listings, dependent: :destroy, class_name: 'Legacy::FullListing'
  has_many :recorded_searches, dependent: :destroy
  has_many :recorded_completions, dependent: :nullify

  has_many :subscriptions
  has_many :charges

  attr_accessor :terms_of_service

  validates :terms_of_service, acceptance: true, on: :create

  TRIAL_CODES = %w[rentalscaleup friendoflistify].freeze
  LISTIFY_TEAM_SCOPE = 'listify_team'.freeze

  def name
    "#{first_name} #{last_name}"
  end

  def admin_or_listify_team?
    admin? || on_listify_team?
  end

  def on_listify_team?
    authorization_scopes.include? LISTIFY_TEAM_SCOPE
  end

  def member_of_team?
    account_status == 'team_member'
  end

  def team_admin?
    team && team_role.admin_privileges?
  end

  def account_links_hidden?
    hidden = ['197d4687-e3a9-40bb-948b-ec0285c3485e', 'd5a62173-ec2b-4cf0-aca5-5bb296eeb710'] # boostly & local test
    hidden.include? id
  end

  def on_trial?
    account_status == 'active_trial'
  end

  def account_status
    UserAccountStatus.new(self).check
  end

  def spin_quota
    SpinCounter.new(self).spin_quota
  end

  def spins_used_in_current_period
    SpinCounter.new(self).spins_used_in_current_period
  end

  def trial_days
    TRIAL_CODES.include?(promotion_code&.downcase) ? 44 : 14
  end

  def trial_end_date
    (created_at + trial_days.days).to_date
  end

  def runs_remaining_today
    SpinCounter.new(self).spins_remaining
  end

  def lock_account!
    update(account_locked: true)
    AdminMailer.user_account_locked(self).deliver_later
  end

  def subscribed?
    subscription&.active?
  end

  def recently_subscribed?
    if subscription
      subscription.active? &&
        subscription.created_at > Time.zone.now - 2.days
    else
      false
    end
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

    sub = Stripe::Subscription.create(args)
    subscription = subscriptions.create(
      stripe_id: sub.id,
      stripe_plan: plan,
      status: sub.status,
      trial_ends_at: (sub.trial_end ? Time.at(sub.trial_end) : nil),
      ends_at: nil
    )

    if sub.status == 'incomplete' && ['requires_action', 'requires_payment_method'].include?(sub.latest_invoice.payment_intent.status)
      raise PaymentIncomplete.new(sub.latest_invoice.payment_intent), 'Subscription requires authentication'
    end

    subscription.send_activation_email
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
