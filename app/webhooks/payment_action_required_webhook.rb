class PaymentActionRequiredWebhook
  def call(event)
    object = event.data.object
    user = User.find_by(stripe_id: object.customer)
    subscription = Subscription.find_by(stripe_id: object.subscription)

    return if user.nil? || subscription.nil?

    return if subscription.created_at.to_date >= Time.zone.today # don't send during signup

    UserMailer.payment_action_required(user, object.payment_intent, subscription).deliver_later
  end
end
