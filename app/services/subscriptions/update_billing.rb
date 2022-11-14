module Subscriptions
  class UpdateBilling
    def self.call(user:, payment_method_id:, customer_attrs:, country:)
      user.update_card(payment_method_id) if payment_method_id

      user.update!(country_code: country) if country

      return unless customer_attrs

      customer_attrs.merge!({ country: country }) if country

      Subscriptions::Customer.update(user, customer_attrs)
    end
  end
end
