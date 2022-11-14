require 'rails_helper'

RSpec.describe 'Api::V1::Area::SearchLocationsController', type: :request do
  include RequestSpecHelper

  before(:each) do
    @user = create(:user)
    @user.update(admin: true)
  end

  def make_request(payload)
    jwt_token = auth_token(@user)
    post '/api/v1/area/search_locations', params: payload, headers: { Authorization: jwt_token }
  end

  describe 'SearchLocations controller' do
    context 'with valid parameter' do
      it 'successfully generate search locations' do
        payload = {
          search_text: 'London',
          search_radius: 5
        }

        make_request(payload)
        expect(response).to have_http_status 200
        expect(JSON.parse(response.body)['message']).to eq 'Successfully Generated Results'
      end
    end

    context 'with non admin user' do
      it 'fails for non admin user' do
        payload = {
          search_text: 'London',
          search_radius: 5
        }

        jwt_token = auth_token(@user)
        @user.update(admin: false)
        post '/api/v1/area/search_locations', params: payload, headers: { Authorization: jwt_token }
        expect(response).to have_http_status 401
        message = JSON.parse(response.body)['message']
        expect(message).to eq 'You are not authorized to access this endpoint. Only admins can access this endpoint.'
      end
    end

      it 'fails if no spins remaining' do
        allow_any_instance_of(SpinCounter).to receive(:spins_remaining).and_return(0)
        payload = {
          search_text: 'London',
          search_radius: 5
        }

        make_request(payload)
        expect(response).to have_http_status 400
        errors = JSON.parse(response.body)['errors']
        expect(errors).to eq [{ 'message' => 'No Spins remaining on your account. Please upgrade or contact us for assistance.' }]
      end

    context 'with invalid parameters' do
      it 'fails for missing parameter ' do
        payload = {
          # search_text: 'London',
          search_radius: 5
        }

        jwt_token = auth_token(@user)
        post '/api/v1/area/search_locations', params: payload, headers: { Authorization: jwt_token }
        expect(response).to have_http_status 400
        errors = JSON.parse(response.body)['errors']
        expect(errors).to eq [{ 'message' => 'search_text is required field and should be less than 100 characters' }]
      end
    end
  end
end
