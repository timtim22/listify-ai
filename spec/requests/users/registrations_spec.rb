require 'rails_helper'

RSpec.describe 'Users::Registrations', type: :request do
  describe '#create' do
    let(:recaptcha) { instance_double(ApiClients::Recaptcha) }
    before do
      allow(ApiClients::Recaptcha).to receive(:new).and_return(recaptcha)
      allow(recaptcha).to receive(:verify_response).and_return({ 'success' => true })
    end

    context 'new user' do
      context 'has a valid team invite' do
        let!(:team_invitation) { create(:team_invitation, email: 'test@email.com') }
        let(:login_params) do
          {
            user: {
              email: 'test@email.com',
              password: 'testpassword',
              password_confirmation: 'testpassword'
            }
          }
        end

        it 'creates user and adds user to the team' do
          expect { post '/users', params: login_params }.to change { User.count }.by(1).and \
            change { TeamRole.count }.by(1)
          expect(team_invitation.reload.accepted?).to be_truthy

          follow_redirect!
          expect(response).to have_http_status(200)
          expect(response.body).to include('You have signed up successfully.')
        end

        it 'sends welcome email' do
          mailer = double
          expect(UserMailer).to receive(:welcome).and_return(mailer)
          expect(mailer).to receive(:deliver_now)
          post '/users', params: login_params
        end
      end

      context 'has an expired team invite' do
        let!(:team_invitation) { create(:team_invitation, email: 'test@email.com', expired_at: Time.zone.now) }

        it 'creates a user and shows a flash alert' do
          login_params = {
            user: {
              email: 'test@email.com',
              password: 'testpassword',
              password_confirmation: 'testpassword'
            }
          }

          expect { post '/users', params: login_params }.to change { User.count }.by(1)
          expect(team_invitation.reload.accepted?).to be_falsey

          follow_redirect!
          expect(response).to have_http_status(200)
          expect(response.body).to include('You have signed up successfully.')
          expect(flash[:alert]).to eq('Your team invitation has expired - please ask your colleague to resend it.')
        end
      end
    end
  end
end
