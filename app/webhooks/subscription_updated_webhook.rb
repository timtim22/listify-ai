class SubscriptionUpdatedWebhook
  def call(event)
    object = event.data.object
    subscription = Subscription.find_by(stripe_id: object.id)
    return if subscription.nil?

    if object.status == "incomplete_expired"
      subscription.destroy
      return
    end

    prev_subscription_status = subscription.status

    subscription.status = object.status
    subscription.trial_ends_at = Time.zone.at(object.trial_end) if object.trial_end

    if object.ended_at
      subscription.ends_at = Time.zone.at(object.ended_at)
    elsif object.cancel_at
      subscription.ends_at = Time.zone.at(object.cancel_at)
    end

    subscription.save

    if prev_subscription_status == "incomplete" && subscription.status == "active"
      subscription.subscribed_successfully_steps
    end
  end
end
