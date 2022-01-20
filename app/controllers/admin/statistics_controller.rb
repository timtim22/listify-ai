class Admin::StatisticsController < ApplicationController
  before_action :authenticate_admin

  def index
    users = User.all
    @users_with_stats = users.map do |user|
      stats = SpinCounter.new(user).spin_stats
      OpenStruct.new(
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        spins_this_month: stats.spins,
        monthly_spin_quota: stats.quota
      )
    end.sort_by { |u| u.spins_this_month }.reverse
  end
end
