module Subscriptions
  class StripeCustomer
    class << self
      def fetch_or_create(user)
        if user.stripe_id
          fetch_customer(user.stripe_id)
        else
          create_customer(user)
        end
      end

      private

      def fetch_customer(stripe_id)
        Stripe::Customer.retrieve(stripe_id)
      end

      def create_customer(user)
        customer = Stripe::Customer.create(email: user.email)
        user.update(stripe_id: customer.id)
        customer
      end
    end
  end
end
