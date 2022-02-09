class UserAccountStatus
  attr_reader :user

  def initialize(user)
    @user = user
  end

  def check
    if ever_subscribed?
      subscription_status
    elsif on_private_beta?
      'private_beta'
    else
      trial_status
    end
  end

  private

  def ever_subscribed?
    user.subscriptions.any? { |s| !s.incomplete? }
  end

  def on_private_beta?
    user.created_at < Date.new(2022, 1, 16)
  end

  def subscription_status
    if current_subscription.active?
      'active_subscription'
    elsif current_subscription.lapsed?
      'lapsed_subscription'
    else
      'unknown_subscription_status'
    end
  end

  def trial_status
    if still_on_trial?
      'active_trial'
    else
      'lapsed_trial'
    end
  end

  def current_subscription
    @current_subscription ||= user.subscription
  end

  def still_on_trial?
    Time.zone.today <= user.trial_end_date
  end
end
