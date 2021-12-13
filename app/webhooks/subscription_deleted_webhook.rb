class SubscriptionDeletedWebhook
  def call(event)
    object = event.data.object
    subscription = Subscription.find_by(stripe_id: object.id)
    return if subscription.nil?

    if subscription.ends_at.blank? && object.ended_at.present?
      subscription.update!(ends_at: Time.at(object.ended_at))
    end
  end
end
