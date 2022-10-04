class AdminMailer < ApplicationMailer
  ADMIN_EMAILS = ['hello@listify.ai', 'srin@listify.ai'].freeze

  def welcome(user)
    @user = user
    mail(
      to: ADMIN_EMAILS,
      subject: 'New Listify user'
    )
  end

  def subscription_activated(user, plan_name)
    @user = user
    @plan_name = plan_name
    mail(
      to: ADMIN_EMAILS,
      subject: 'New Listify subscription'
    )
  end

  def subscription_cancelled(user)
    @user = user
    mail(
      to: ADMIN_EMAILS,
      subject: 'Cancelled Listify subscription'
    )
  end

  def subscription_swapped(user, plan_name)
    @user = user
    @plan_name = plan_name
    mail(
      to: ADMIN_EMAILS,
      subject: 'Changed Listify plan'
    )
  end

  def user_account_locked(user)
    @user = user
    mail(
      to: ADMIN_EMAILS,
      subject: 'User account locked!'
    )
  end

  def unexpected_search_volume
    mail(
      to: ADMIN_EMAILS,
      subject: 'Unexpected recorded search volume!'
    )
  end

  def spins_80_percent_consumed(team, spins_used)
    @team_name = team.name
    @monthly_spins = team.monthly_spins
    @spins_used = spins_used
    mail(
      to: ADMIN_EMAILS,
      subject: "#{@team_name} has used up 80% of their monthly spins!"
    )
  end

  def monthly_spin_usage(teams_data)
    @teams_data = teams_data
    mail(
      to: ADMIN_EMAILS,
      subject: 'Monthly Spin Usage'
    )
  end
end
