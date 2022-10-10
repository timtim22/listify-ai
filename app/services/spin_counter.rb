class SpinCounter
  DERIVATIVE_TASK_TYPES = ['DerivedInputObject'].freeze
  BUILDER_TASK_TYPES = [
    'Inputs::SummaryFragment',
    'Inputs::BedroomFragment',
    'Inputs::OtherRoomFragment',
    'Inputs::AreaDescriptionFragment'
  ].freeze
  IGNORED_TASK_TYPES = [DERIVATIVE_TASK_TYPES, BUILDER_TASK_TYPES].flatten
  TRIAL_SPINS = 100

  attr_reader :user

  def initialize(user = nil)
    @user = user
  end

  def spin_quota
    if user.member_of_team?
      team_spins_quota
    elsif user.custom_run_limit?
      user.custom_run_limit
    elsif user.subscribed?
      user.subscription.plan.monthly_spin_cap
    elsif user.on_trial? || user.private_beta_account? || user.admin_or_listify_team?
      TRIAL_SPINS
    else
      5
    end
  end

  def spins_used_in_current_period
    if user.subscription
      subscription_spins_used(user.subscription)
    elsif user.on_trial?
      spins_since(user.created_at)
    else
      spins_this_month
    end
  end

  def spins_remaining
    if user.admin_or_listify_team?
      TRIAL_SPINS
    elsif user.member_of_team?
      spin_quota - team_spins_within(user.team, start_of_month)
    else
      spin_quota - spins_used_in_current_period
    end
  end

  def team_spins_used
    team_spins_within(user.team, start_of_month)
  end

  def team_spins_used_yesterday
    team_spins_within(user.team, start_of_month, Time.zone.now - 1.day)
  end

  def spin_stats
    OpenStruct.new(spins: spins_used_in_current_period, quota: spin_quota)
  end

  def team_spin_stats(team)
    end_of_week = Time.zone.now
    start_of_previous_month = (start_of_month - 1.day).beginning_of_month.beginning_of_day
    end_of_previous_month = start_of_previous_month.end_of_month.end_of_day
    spin_usage_this_month = team_spins_within(team, start_of_month)
    spin_usage_previous_month = team_spins_within(team, start_of_previous_month, end_of_previous_month)
    {
      name: team.name,
      spin_usage_7_days: team_spins_within(team, end_of_week - 7.days, end_of_week),
      spin_usage_this_month: spin_usage_this_month,
      spin_usage_previous_month: spin_usage_previous_month,
      spin_usage_increase: team_spin_usage_increase(spin_usage_this_month, spin_usage_previous_month)
    }
  end

  private

  def team_spin_usage_increase(spin_usage_this_month, spin_usage_previous_month)
    return 0.0 if spin_usage_previous_month.zero?

    (spin_usage_this_month / spin_usage_previous_month.to_f) * 100
  end

  def team_spins_quota
    user.team.monthly_spins
  end

  def subscription_spins_used(subscription)
    if subscription.created_at >= Time.zone.now.beginning_of_month
      spins_since(subscription.created_at)
    else
      spins_this_month
    end
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

  def team_spins_within(team, start_datetime, end_datetime = Time.zone.now)
    user_ids = team.users.pluck(:id)
    team_runs_within(user_ids, start_datetime, end_datetime) + team_builder_listings_within(user_ids, start_datetime, end_datetime)
  end

  def team_runs_within(team_user_ids, start_datetime, end_datetime)
    TaskRun
      .where(user_id: team_user_ids)
      .where.not(input_object_type: IGNORED_TASK_TYPES)
      .where('created_at > ? AND created_at <= ?', start_datetime, end_datetime)
      .count
  end

  def team_builder_listings_within(team_user_ids, start_datetime, end_datetime)
    builder_runs = TaskRun.where(user_id: team_user_ids)
      .where(input_object_type: BUILDER_TASK_TYPES)
      .where('created_at > ? AND created_at <= ?', start_datetime, end_datetime)
      .count
    builder_runs / 3 # rounds down %
  end

  def start_of_month
    @start_of_month ||= Time.zone.today.beginning_of_month.beginning_of_day
  end
end
