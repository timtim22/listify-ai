Stripe.api_key = Rails.application.credentials.stripe[:private_key]

class PaymentIncomplete < StandardError
  attr_reader :payment_intent

  def initialize(payment_intent)
    @payment_intent = payment_intent
  end
end

StripeEvent.signing_secret = ENV['STRIPE_SIGNING_SECRET'] || Rails.application.credentials.stripe[:signing_secret]
StripeEvent.configure do |events|
  events.subscribe 'customer.subscription.updated', SubscriptionUpdatedWebhook.new
end
