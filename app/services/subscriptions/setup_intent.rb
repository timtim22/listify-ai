module Subscriptions
  class SetupIntent
    class << self
      def create(user)
        user.stripe_customer unless user.stripe_id
        Stripe::SetupIntent.create(customer: user.stripe_id)
      end
    end
  end
end
