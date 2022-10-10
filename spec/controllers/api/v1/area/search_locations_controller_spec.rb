require 'rails_helper'

RSpec.describe 'Api::V1::Area::SearchLocationsController', type: :request do
  include RequestSpecHelper

  before(:each) do
    @user = create(:user)
    @user.update(admin: true)
  end

  describe 'SearchLocations controller' do
    context 'with valid parameter' do
      it 'successfully generate search locations ' do
        payload = {
          search_text: 'London',
          attraction_radius: 500
        }

        jwt_token = auth_token(@user)
        post '/api/v1/area/search_locations', params: payload, headers: { Authorization: jwt_token }
        expect(response).to have_http_status 200
        expect(JSON.parse(response.body)['message']).to eq 'Successfully Generated Results'
      end
    end

    context 'with non admin user' do
      it 'fails for non admin user ' do
        payload = {
          # search_text: 'London',
          attraction_radius: 500
        }

        jwt_token = auth_token(@user)
        @user.update(admin: false)
        post '/api/v1/area/search_locations', params: payload, headers: { Authorization: jwt_token }
        expect(response).to have_http_status 401
        expect(eval(response.body)[:message]).to eq 'You are not authorized to access this endpoint. Only admin can access this endpoint.'
      end
    end

    context 'with invalid parameters' do
      it 'fails for missing parameter ' do
        payload = {
          # search_text: 'London',
          attraction_radius: 500
        }

        jwt_token = auth_token(@user)
        post '/api/v1/area/search_locations', params: payload, headers: { Authorization: jwt_token }
        expect(response).to have_http_status 400
        expect(eval(response.body)[:message]).to eq 'search_text is required field and should be less than 100 characters'
      end
    end
  end
end
