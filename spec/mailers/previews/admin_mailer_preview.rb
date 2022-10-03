class AdminMailerPreview < ActionMailer::Preview
  def welcome
    AdminMailer.welcome(User.first)
  end

  def subscription_activated
    AdminMailer.subscription_activated(Subscription.first.user, Plan.first.name)
  end

  def subscription_cancelled
    AdminMailer.subscription_cancelled(Subscription.first.user)
  end

  def subscription_swapped
    AdminMailer.subscription_swapped(Subscription.first.user, Plan.first.name)
  end

  def user_account_locked
    AdminMailer.user_account_locked(User.first)
  end

  def unexpected_search_volume
    AdminMailer.unexpected_search_volume
  end

  def spins_80_percent_consumed
    AdminMailer.spins_80_percent_consumed(Team.first, 20)
  end

  def monthly_spin_usage
    teams_data = Team.all.map do |team|
      spin_counter = SpinCounter.new
      spin_counter.team_spin_stats(team)
    end
    AdminMailer.monthly_spin_usage(teams_data)
  end
end
