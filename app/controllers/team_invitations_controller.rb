class TeamInvitationsController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_team_invitation
  before_action :set_team
  before_action :set_team_invitation, only: %i[destroy resend]

  def new
    @team_invitation = @team.team_invitations.new
  end

  def create
    @team_invitation = @team.team_invitations.new(
      team_invitation_params.merge(
        status: 'pending', expired_at: Time.zone.now + 7.days, invited_by: current_user.email
      )
    )
    respond_to do |format|
      if @team_invitation.save
        if @team.send("add_#{@team_invitation.role}", @team_invitation.email)
          @team_invitation.accepted!
          UserMailer.member_added_on_team(@team_invitation.email, @team_invitation.role, @team.name).deliver_later
          format.html { redirect_to team_path(@team.id), notice: 'User was added to the team successfully.' }
        else
          UserMailer.team_invitation(@team_invitation.email, @team_invitation.role, @team.name).deliver_later
          format.html { redirect_to team_path(@team.id), notice: 'Team invitation was sent to the user successfully.' }
        end
      else
        format.html { render :new, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    respond_to do |format|
      if @team_invitation.accepted?
        flash[:alert] = 'Deletion of accepted team invitation is not allowed.'
      elsif @team_invitation.destroy
        flash[:notice] = 'Team invitation was deleted successfully.'
      else
        flash[:alert] = 'An error occurred while deleting the team invitation.'
      end

      format.html { redirect_to team_path(@team.id) }
    end
  end

  def resend
    UserMailer.team_invitation(@team_invitation.email, @team_invitation.role, @team.name).deliver_later
    @team_invitation.update(expired_at: @team_invitation.expired_at + 7.days)
    respond_to do |format|
      format.html { redirect_to team_path(@team.id), notice: 'Team invitation was resent successfully.' }
    end
  end

  private

  def set_team
    @team ||= Team.find(params[:team_id])
  end

  def team_invitation_params
    params.require(:team_invitation).permit(:email, :role)
  end

  def set_team_invitation
    @team_invitation = TeamInvitation.find(params[:id])
  end

  def authorize_team_invitation
    authorize TeamInvitation
  end
end
