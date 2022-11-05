require 'rails_helper'

RSpec.describe 'Api::V1::Area::DescriptionsController', type: :request do
  include RequestSpecHelper

  before(:each) do
    @user = create(:user)
    @user.update(admin: true)
    @search_location = create(:search_location)
    @area_description = create(:area_description, search_location_id: @search_location.id)
  end

  def make_request(payload)
    jwt_token = auth_token(@user)
    post '/api/v1/area/descriptions', params: payload, headers: { Authorization: jwt_token }
  end

  describe 'descriptions controller' do
    context 'with non admin user' do
      it 'fails for non admin user ' do
        payload = {
          search_location_id: '73b59600-e130-484b-a156-045a42215a52',
          selected_ids: ['ChIJa4bODTG-3zgREyhIEMZJPdo', 'ChIJa4bODTG-3zgREyhIEMZJPdo'],
          detail_text: ['cat', 'dog']
        }

        @user.update(admin: false)
        make_request(payload)
        expect(response).to have_http_status 401
        expect(JSON.parse(response.body)['message']).to eq 'You are not authorized to access this endpoint. Only admins can access this endpoint.'
      end
    end

    context 'with invalid parameters' do
      it 'fails for missing invalid search location' do
        payload = {
          search_location_id: "asdasd",
          selected_ids: ['ChIJa4bODTG-3zgREyhIEMZJPdo', 'ChIJa4bODTG-3zgREyhIEMZJPdo'],
          detail_text: ['cat', 'dog']
        }

        make_request(payload)
        expect(response).to have_http_status 400
        errors = JSON.parse(response.body)['errors']
        expect(errors).to eq [{ 'message' => 'search_location does not exist' }]
      end

      it 'fails for missing selected_ids' do
        payload = {
          search_location_id: @search_location.id,
          # selected_ids: ['ChIJa4bODTG-3zgREyhIEMZJPdo', 'ChIJa4bODTG-3zgREyhIEMZJPdo'],
          detail_text: ['cat', 'dog']
        }

        make_request(payload)
        expect(response).to have_http_status 400
        errors = JSON.parse(response.body)['errors']
        expect(errors).to eq [{ 'message' => 'Selected IDs cannot be nil. Please select at least 3 place_ids for the best description' }]
      end

      it 'fails for invalid detail_text' do
        payload = {
          search_location_id: @search_location.id,
          selected_ids: ['ChIJa4bODTG-3zgREyhIEMZJPdo', 'ChIJa4bODTG-3zgREyhIEMZJPdo'],
          detail_text: 'cat'
        }

        make_request(payload)
        expect(response).to have_http_status 400

        errors = JSON.parse(response.body)['errors']
        expect(errors).to eq [{ 'message' => "Invalid detail_text format. Kindly use the following format: ['famous for nightlife', 'Great location for exploring the city']" }]
      end

      it 'fails for missing detail_text' do
        payload = {
          search_location_id: @search_location.id,
          selected_ids: ['ChIJa4bODTG-3zgREyhIEMZJPdo', 'ChIJa4bODTG-3zgREyhIEMZJPdo'],
          # detail_text: 'cat'
        }

        make_request(payload)
        expect(response).to have_http_status 400
        errors = JSON.parse(response.body)['errors']
        expect(errors).to eq [{ 'message' => 'detail_text cannot be blank' }]
      end

      it 'fails if no spins remaining' do
        allow_any_instance_of(SpinCounter).to receive(:spins_remaining).and_return(0)
        payload = {
          search_location_id: @search_location.id,
          selected_ids: ['ChIJa4bODTG-3zgREyhIEMZJPdo', 'ChIJa4bODTG-3zgREyhIEMZJPdo'],
          detail_text: ['famous for nightlife']
        }

        make_request(payload)
        expect(response).to have_http_status 400
        errors = JSON.parse(response.body)['errors']
        expect(errors).to eq [{ 'message' => 'No Spins remaining on your account. Please upgrade or contact us for assistance.' }]
      end


    end
  end
end
