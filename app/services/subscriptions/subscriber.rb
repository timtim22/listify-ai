module Subscriptions
  class Subscriber

    attr_reader :user, :stripe_plan, :options

    def initialize(user, stripe_plan, options)
      @user = user
      @stripe_plan = stripe_plan
      @options = options
    end

    def call
      create_stripe_customer_for_user
      remote_sub = create_remote_subscription
      local_sub  = create_local_subscription(remote_sub)
      raise_error_if_payment_needs_authentication(remote_sub)

      #local_sub.send_confirmation_call(company_name, subscription.plan)
      local_sub.send_confirmation_email
      local_sub
    end

    def create_remote_subscription
      args = {
        customer: user.stripe_id,
        items: [{ price: stripe_plan }],
        expand: ['latest_invoice.payment_intent'],
        off_session: true
      }.merge(options)

      Stripe::Subscription.create(args)
    end

    def create_local_subscription(remote_sub)
      user.subscriptions.create(
        stripe_id: remote_sub.id,
        stripe_plan: stripe_plan,
        status: remote_sub.status,
        trial_ends_at: (remote_sub.trial_end ? Time.zone.at(remote_sub.trial_end) : nil),
        ends_at: nil
      )
    end

    def create_stripe_customer_for_user
      user.stripe_customer unless user.stripe_id
    end

    def raise_error_if_payment_needs_authentication(remote_sub)
      return unless remote_sub.status == 'incomplete'

      payment = remote_sub.latest_invoice.payment_intent
      raise_payment_error(payment) if payment_requires_action?(payment)
    end

    def payment_requires_action?(payment)
      %w[requires_action requires_payment_method].include?(payment.status)
    end

    def raise_payment_error(payment)
      raise PaymentIncomplete.new(payment), 'Subscription requires authentication'
    end
  end
end
