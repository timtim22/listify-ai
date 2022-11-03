require 'rails_helper'

RSpec.describe 'Api::V1::Users::AuthenticationController', type: :request do
  before(:each) do
    @user = create(:user)
  end

  describe 'authentication controller' do
    context 'with valid parameter' do
      it 'to successfully login ' do
        login_params = {
          email: @user.email,
          password: @user.password
        }
        post '/api/v1/users/sign_in', params: login_params.merge(format: :json)
        expect(response).to have_http_status 200
        expect(eval(response.body)[:message]).to eq 'Signed in successfully.'
      end
    end

    context 'with invalid parameter' do
      it 'to give an error when passing empty parameter' do
        login_params = {
          email: @user.email,
          password: ''
        }
        post '/api/v1/users/sign_in', params: login_params.merge(format: :json)
        expect(response).to have_http_status 400
        expect(eval(response.body)[:message]).to eq 'Email and password are required fields.'
      end

      it 'to give an error when not passing or nil parameter' do
        login_params = {
          password: @user.password
        }
        post '/api/v1/users/sign_in', params: login_params.merge(format: :json)
        expect(response).to have_http_status 400
        expect(eval(response.body)[:message]).to eq 'Email and password are required fields.'
      end
    end

    context 'with invalid user' do
      it 'to give an error when user doesnt exist' do
        login_params = {
          email: "test@test.com",
          password: 'pass'
        }
        post '/api/v1/users/sign_in', params: login_params.merge(format: :json)
        expect(response).to have_http_status 404
        expect(eval(response.body)[:message]).to eq 'Could not authenticate. Please check your credentials and try again.'
      end

    end
  end
end
