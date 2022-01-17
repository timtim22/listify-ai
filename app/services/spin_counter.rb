class SpinCounter

  DERIVATIVE_TASK_TYPES = ["ListingFragment", "DerivedInputObject"].freeze
  DAILY_BETA_SPINS = 20

  attr_reader :user

  def initialize(user)
    @user = user
  end

  def spins_remaining
    if user.admin?
      DAILY_BETA_SPINS
    elsif user.on_private_beta?
      beta_user_spins_remaining
    else
      0
    end
  end

  def beta_user_spins_remaining
    if user.custom_run_limit
      user.custom_run_limit - spins_today
    else
      DAILY_BETA_SPINS - spins_today
    end
  end

  def spins_today
    spins_since(Date.today.beginning_of_day)
  end

  def spins_this_month
    spins_since(Date.today.beginning_of_month.beginning_of_day)
  end

  def spins_since(datetime)
    runs_since(datetime) + full_listings_since(datetime)
  end

  def runs_since(datetime)
    user.task_runs
      .where.not(input_object_type: DERIVATIVE_TASK_TYPES)
      .where('created_at > ?', datetime)
      .count
  end

  def full_listings_since(datetime)
    user.full_listings
      .where('created_at > ?', datetime)
      .count
  end
end
