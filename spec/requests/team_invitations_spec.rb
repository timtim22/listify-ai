require 'rails_helper'

RSpec.describe 'TeamInvitations', type: :request do
  describe '#create' do
    before(:each) do
      @user = create(:user)
      create(:team_role, team: team, user: @user, name: 'admin')
      login_as(@user)
    end

    context 'when user already exists' do
      let(:team) { create(:team) }
      let(:user) { create(:user, email: 'test@email.com') }
      let(:team_invitation_params) do
        {
          team_invitation: {
            email: 'test@email.com',
            role: 'admin'
          }
        }
      end
      it 'creates a team invitation and send team invitation' do
        allow_any_instance_of(Team).to receive(:add_admin).and_return(false)
        mailer = double
        expect(UserMailer).to receive(:team_invitation).and_return(mailer)
        expect(mailer).to receive(:deliver_later)
        expect { post team_team_invitations_path(team), params: team_invitation_params }
          .to change { TeamInvitation.count }.by(1)

        follow_redirect!
        expect(response).to have_http_status(200)
        expect(response.body).to include('Team invitation was sent to the user successfully.')
      end
    end

    context 'when user does not exist' do
      let(:team) { create(:team) }
      let(:team_invitation_params) do
        {
          team_invitation: {
            email: 'test@email.com',
            role: 'admin'
          }
        }
      end
      it 'creates a team invitation and send member added on team email' do
        allow_any_instance_of(Team).to receive(:add_admin).and_return(true)
        mailer = double
        expect(UserMailer).to receive(:member_added_on_team).and_return(mailer)
        expect(mailer).to receive(:deliver_later)
        expect { post team_team_invitations_path(team), params: team_invitation_params }
          .to change { TeamInvitation.count }.by(1)

        follow_redirect!
        expect(response).to have_http_status(200)
        expect(response.body).to include('User was added to the team successfully.')
      end
    end
  end
end
