class Admin::StatisticsController < ApplicationController
  before_action :authenticate_admin

  def index
    users = User.all.includes(:team)
    @users_with_stats = users.map do |user|
      stats = SpinCounter.new(user).spin_stats
      OpenStruct.new(
        id: user.id,
        email: user.email,
        admin: user.admin,
        locked: user.account_locked,
        created_at: user.created_at,
        created_today: user.created_at > Date.today.beginning_of_day,
        created_last_7_days: user.created_at > (Date.today - 7.days).beginning_of_day,
        spins_this_month: stats.spins,
        monthly_spin_quota: stats.quota,
        team_name: user.team&.name,
        account_status: user.account_status,
        user_object: user
      )
    end.sort_by { |u| u.spins_this_month }.reverse
    @new_users = @users_with_stats.select(&:created_today)
  end
end
