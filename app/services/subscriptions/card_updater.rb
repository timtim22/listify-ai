module Subscriptions
  class CardUpdater

    attr_reader :user, :payment_method_id

    def initialize(user, payment_method_id)
      @user = user
      @payment_method_id = payment_method_id
    end

    def call
      ensure_stripe_customer_for_user
      new_payment_method = add_payment_method
      update_user_default_payment_method(new_payment_method)
      update_user_card_attrs(new_payment_method)

    end

    private

    def add_payment_method
      Stripe::PaymentMethod.attach(
        payment_method_id,
        { customer: user.stripe_id }
      )
    end

    def update_user_default_payment_method(new_payment_method)
      Stripe::Customer.update(
        user.stripe_id,
        invoice_settings: { default_payment_method: new_payment_method.id }
      )
    end

    def update_user_card_attrs(new_payment_method)
      user.update(
        card_brand: new_payment_method.card.brand.titleize,
        card_last4: new_payment_method.card.last4,
        card_exp_month: new_payment_method.card.exp_month,
        card_exp_year: new_payment_method.card.exp_year
      )
    end

    def ensure_stripe_customer_for_user
      user.stripe_customer unless user.stripe_id
    end
  end
end
