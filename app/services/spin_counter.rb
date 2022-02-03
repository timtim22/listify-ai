class SpinCounter

  DERIVATIVE_TASK_TYPES = ["ListingFragment", "DerivedInputObject"].freeze
  BUILDER_TASK_TYPES = ["Inputs::SummaryFragment", "Inputs::BedroomFragment", "Inputs::OtherRoomFragment"].freeze
  IGNORED_TASK_TYPES = [DERIVATIVE_TASK_TYPES, BUILDER_TASK_TYPES].flatten
  DAILY_BETA_SPINS = 20
  TRIAL_SPINS = 100

  attr_reader :user

  def initialize(user)
    @user = user
  end

  def spins_remaining
    if user.admin?
      DAILY_BETA_SPINS
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
    OpenStruct.new(spins: spins_this_month, quota: monthly_spin_quota)
  end

  private

  def monthly_spin_quota
    if user.subscribed?
      user.subscription.plan.monthly_spin_cap
    elsif user.on_trial?
      TRIAL_SPINS
    else
      nil
    end
  end

  def subscription_spins_remaining
    user.subscription.plan.monthly_spin_cap - spins_this_month
  end

  def trial_spins_remaining
    TRIAL_SPINS - spins_since(user.created_at)
  end

  def beta_user_spins_remaining
    DAILY_BETA_SPINS - spins_today
  end

  def spins_today
    spins_since(Date.today.beginning_of_day)
  end

  def spins_this_month
    spins_since(Date.today.beginning_of_month.beginning_of_day)
  end

  def spins_since(datetime)
    runs_since(datetime) + full_listings_since(datetime) + builder_listings_since(datetime)
  end

  def runs_since(datetime)
    user.task_runs
      .where.not(input_object_type: IGNORED_TASK_TYPES)
      .where('created_at > ?', datetime)
      .count
  end

  def full_listings_since(datetime)
    user.full_listings
      .where('created_at > ?', datetime)
      .count
  end

  def builder_listings_since(datetime)
    builder_runs =  user.task_runs
      .where(input_object_type: BUILDER_TASK_TYPES)
      .where('created_at > ?', datetime)
      .count
    builder_runs / 3 #rounds down %
  end
end
