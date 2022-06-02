class UserAccountStatus
  attr_reader :user

  def initialize(user)
    @user = user
  end

  def check
    if user.admin? || user.on_listify_team?
      'listify_team'
    elsif user.private_beta_account?
      'private_beta'
    elsif member_of_team?
      'team_member'
    elsif ever_subscribed?
      subscription_status
    else
      trial_status
    end
  end

  private

  def member_of_team?
    user.team && !user.team_role.purchaser?
  end

  def ever_subscribed?
    user.subscriptions.any? { |s| !s.incomplete? }
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
