Stripe.api_key = Rails.application.credentials.stripe[:private_key]

class PaymentIncomplete < StandardError
  attr_reader :payment_intent

  def initialize(payment_intent)
    @payment_intent = payment_intent
  end
end
