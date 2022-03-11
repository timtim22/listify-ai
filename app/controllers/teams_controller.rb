class TeamsController < ApplicationController
  before_action :authenticate_user!
  before_action :authenticate_team_admin

  def show
    @team = Team.find(params[:id])
    @team_users = @team.users.includes(:team_role)
  end

  private

  def authenticate_team_admin
    authorised = current_user.team_admin? || current_user.admin?
    redirect_to '/', alert: 'Not authorized.' unless authorised
  end
end
