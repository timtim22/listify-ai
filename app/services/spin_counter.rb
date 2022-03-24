class SpinCounter

  DERIVATIVE_TASK_TYPES = ['ListingFragment', 'DerivedInputObject'].freeze
  BUILDER_TASK_TYPES = [
    'Inputs::SummaryFragment',
    'Inputs::BedroomFragment',
    'Inputs::OtherRoomFragment',
    'Inputs::AreaDescriptionFragment'
  ].freeze
  IGNORED_TASK_TYPES = [DERIVATIVE_TASK_TYPES, BUILDER_TASK_TYPES].flatten
  DAILY_BETA_SPINS = 30
  TRIAL_SPINS = 100

  attr_reader :user

  def initialize(user)
    @user = user
  end

  def spins_remaining
    if user.admin?
      DAILY_BETA_SPINS
    elsif user.member_of_team?
      team_spins_remaining
    elsif user.custom_run_limit?
      user.custom_run_limit - spins_today
    elsif user.on_private_beta?
      beta_user_spins_remaining
    elsif user.subscribed?
      subscription_spins_remaining
    elsif user.on_trial?
      trial_spins_remaining
    else
      0
    end
  end

  def spin_stats
    OpenStruct.new(spins: spins_in_current_period, quota: monthly_spin_quota)
  end

  private

  def monthly_spin_quota
    if user.member_of_team?
      team_spins_quota
    elsif user.subscribed?
      user.subscription.plan.monthly_spin_cap
    elsif user.on_trial?
      TRIAL_SPINS
    else
      nil
    end
  end

  def spins_in_current_period
    if user.subscription
      subscription_spins_used(user.subscription)
    else
      spins_this_month
    end
  end

  def team_spins_remaining
    team_spins_quota - team_spins_since(start_of_month, user.team)
  end

  def team_spins_quota
    user.team.monthly_spins
  end

  def subscription_spins_remaining
    user.subscription.plan.monthly_spin_cap - subscription_spins_used(user.subscription)
  end

  def subscription_spins_used(subscription)
    if subscription.created_at >= Time.zone.now.beginning_of_month
      spins_since(subscription.created_at)
    else
      spins_this_month
    end
  end

  def trial_spins_remaining
    TRIAL_SPINS - spins_since(user.created_at)
  end

  def beta_user_spins_remaining
    DAILY_BETA_SPINS - spins_today
  end

  def spins_today
    spins_since(Time.zone.today.beginning_of_day)
  end

  def spins_this_month
    spins_since(start_of_month)
  end

  def spins_since(datetime)
    runs_since(datetime) + builder_listings_since(datetime)
  end

  def runs_since(datetime)
    user.task_runs
      .where.not(input_object_type: IGNORED_TASK_TYPES)
      .where('created_at > ?', datetime)
      .count
  end

  def builder_listings_since(datetime)
    builder_runs = user.task_runs
      .where(input_object_type: BUILDER_TASK_TYPES)
      .where('created_at > ?', datetime)
      .count
    builder_runs / 3 #rounds down %
  end

  def team_spins_since(datetime, team)
    user_ids = team.users.pluck(:id)
    team_runs_since(datetime, user_ids) + team_builder_listings_since(datetime, user_ids)
  end

  def team_runs_since(datetime, team_user_ids)
    TaskRun
      .where(user_id: team_user_ids)
      .where.not(input_object_type: IGNORED_TASK_TYPES)
      .where('created_at > ?', datetime)
      .count
  end

  def team_builder_listings_since(datetime, team_user_ids)
    builder_runs = TaskRun.where(user_id: team_user_ids)
      .where(input_object_type: BUILDER_TASK_TYPES)
      .where('created_at > ?', datetime)
      .count
    builder_runs / 3 # rounds down %
  end

  def start_of_month
    Time.zone.today.beginning_of_month.beginning_of_day
  end
end
