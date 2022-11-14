class SubscriptionDeletedWebhook
  def call(event)
    object = event.data.object
    subscription = Subscription.find_by(stripe_id: object.id)
    return if subscription.nil?

    subscription.status = object.status

    if subscription.ends_at.blank? && object.ended_at.present?
      subscription.ends_at = Time.zone.at(object.ended_at)
    end

    subscription.save!

    AdminMailer.subscription_deleted(subscription.user).deliver_later
  end
end
