class Admin::TeamsController < ApplicationController
  before_action :authenticate_admin

  def index
    @q = User.with_team.ransack(params[:q])
    @users = @q.result.includes(:team, team_role: [:team]).order(created_at: :desc)

    @pagy, @users = pagy(@users, items: 30)
  end
end
