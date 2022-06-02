class UserAccountStatus
  attr_reader :user

  LISTIFY_TEAM = 'listify_team'.freeze
  PRIVATE_BETA = 'private_beta'.freeze
  TEAM_MEMBER  = 'team_member'.freeze
  ACTIVE_SUB   = 'active_subscription'.freeze
  LAPSED_SUB   = 'lapsed_subscription'.freeze
  UNKNOWN_SUB  = 'unknown_subscription'.freeze
  ACTIVE_TRIAL = 'active_trial'.freeze
  LAPSED_TRIAL = 'lapsed_trial'.freeze
  TRIAL_STATES = [ACTIVE_TRIAL, LAPSED_TRIAL].freeze

  def self.tally_all
    users = User.all.includes(:subscriptions, :team, :team_role)
    users.map(&:account_status).tally
  end

  def initialize(user)
    @user = user
  end

  def check
    if user.admin? || user.on_listify_team?
      LISTIFY_TEAM
    elsif user.private_beta_account?
      PRIVATE_BETA
    elsif member_of_team?
      TEAM_MEMBER
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
      ACTIVE_SUB
    elsif current_subscription.lapsed?
      LAPSED_SUB
    else
      UNKNOWN_SUB
    end
  end

  def trial_status
    if still_on_trial?
      ACTIVE_TRIAL
    else
      LAPSED_TRIAL
    end
  end

  def current_subscription
    @current_subscription ||= user.subscription
  end

  def still_on_trial?
    Time.zone.today <= user.trial_end_date
  end
end
