class TeamRolesController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_team_role

  def destroy
    @team_role = TeamRole.find(params[:id])
    team_id = @team_role.team_id
    respond_to do |format|
      if @team_role.admin_privileges?
        format.html { redirect_to team_path(team_id), alert: 'Removal of admin is not allowed.' }
      else
        if @team_role.destroy
          format.html { redirect_to team_path(team_id), notice: 'User removed from the team successfully.' }
        else
          format.html { rredirect_to team_path(team_id), alert: 'An error occurred while removing the user from the team.' }
        end
      end
    end
  end

  private

  def authorize_team_role
    authorize TeamRole
  end
end
