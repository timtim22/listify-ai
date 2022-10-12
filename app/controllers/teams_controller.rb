class TeamsController < ApplicationController
  before_action :authenticate_user!

  def show
    @team = Team.find(params[:id])
    @team_users = @team.users.includes(:team_role)
    @team_invitations = @team.team_invitations
  end
end
