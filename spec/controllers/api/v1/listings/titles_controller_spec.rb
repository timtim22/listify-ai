require 'rails_helper'

RSpec.describe 'Api::V1::Listings::TitlesController', type: :request do
  include RequestSpecHelper

  before(:each) do
    @user = create(:user)
    @user.update(admin: true)
  end

  def make_request(payload)
    jwt_token = auth_token(@user)
    post '/api/v1/listings/titles', params: payload, headers: { Authorization: jwt_token }
  end

  describe 'titles controller' do
    it 'should return sucessfully response ' do
      procedure = create(:procedure, title: 'Listing', tag: 'listing_title')
      step_prompt = create('Step::Prompt')
      create(:registered_step, procedure_id: procedure.id, step: step_prompt)
      payload = {
        output_language: "EN",
        text: {
          location: 'london',
          property_type: 'house',
          number_of_bedrooms: 2,
          ideal_for: 'couple',
          features: ['parking']
        }
      }

      make_request(payload)
      expect(Input.first.inputable_type).to eq 'Listing'
      expect(TaskRun.first.input_object_type).to eq 'Listing'
    end
  end

  describe 'descriptions controller' do
    context 'with invalid parameter' do
      it 'fails for missing parameter ' do
        payload = {
          output_language: "EN",
          text: {
            # location: 'london',
            property_type: 'house',
            number_of_bedrooms: 2,
            ideal_for: 'couple',
            features: ['parking']
          }
        }

        make_request(payload)
        expect(response).to have_http_status 400
        errors = JSON.parse(response.body)['errors']
        expect(errors).to eq [{ 'message' => 'Field(s) missing. Required fields are property_type, ideal_for, location, number_of_bedrooms, features' }]
      end

      it 'fails for character count exceeding limit for location' do
        payload = {
          output_language: "EN",
          text: {
            location: 'l' * 71,
            property_type: 'house',
            number_of_bedrooms: 2,
            ideal_for: 'couple',
            features: ['parking']
          }
        }

        make_request(payload)
        expect(response).to have_http_status 400
        errors = JSON.parse(response.body)['errors']
        expect(errors).to eq [{ 'message' => 'location should be less than 70 characters' }]
      end

      it 'fails for character count exceeding limit for property_type' do
        payload = {
          output_language: "EN",
          text: {
            location: 'london',
            property_type: 'l' * 71,
            number_of_bedrooms: 2,
            ideal_for: 'couple',
            features: ['parking']
          }
        }

        make_request(payload)
        expect(response).to have_http_status 400
        errors = JSON.parse(response.body)['errors']
        expect(errors).to eq [{ 'message' => 'property_type should be less than 70 characters' }]
      end

      it 'fails for character count exceeding limit for ideal_for' do
        payload = {
          output_language: "EN",
          text: {
            location: 'london',
            property_type: 'house',
            number_of_bedrooms: 2,
            ideal_for: 'l' * 71,
            features: ['parking']
          }
        }

        make_request(payload)
        expect(response).to have_http_status 400
        errors = JSON.parse(response.body)['errors']
        expect(errors).to eq [{ 'message' => 'ideal_for should be less than 70 characters' }]
      end

      it 'fails for unsupported output features' do
        payload = {
          output_language: "EN",
          text: {
            location: 'london',
            property_type: 'house',
            number_of_bedrooms: 1,
            ideal_for: 'couple',
            features: Array.new(52, 'parking')
          }
        }

        make_request(payload)
        expect(response).to have_http_status 400
        errors = JSON.parse(response.body)['errors']
        expect(errors).to eq [{ 'message' => 'features should be less than 360 characters in total' }]
      end

      it 'fails for exceeding limit for number of bedrooms' do
        payload = {
          output_language: "EN",
          text: {
            location: 'london',
            property_type: 'house',
            number_of_bedrooms: 101,
            ideal_for: 'couple',
            features: ['parking']
          }
        }

        make_request(payload)
        expect(response).to have_http_status 400
        errors = JSON.parse(response.body)['errors']
        expect(errors).to eq [{ 'message' => 'number_of_bedrooms should be between 0 and 100' }]
      end

      it 'fails for negative number_of_bedrooms' do
        payload = {
          output_language: "EN",
          text: {
            location: 'london',
            property_type: 'house',
            number_of_bedrooms: -1,
            ideal_for: 'couple',
            features: ['parking']
          }
        }

        make_request(payload)
        expect(response).to have_http_status 400
        errors = JSON.parse(response.body)['errors']
        expect(errors).to eq [{ 'message' => 'number_of_bedrooms should be between 0 and 100' }]
      end

      it 'fails if no spins remaining' do
        allow_any_instance_of(SpinCounter).to receive(:spins_remaining).and_return(0)
        payload = {
          output_language: "EN",
          text: {
            location: 'london',
            property_type: 'house',
            number_of_bedrooms: 2,
            ideal_for: 'couple',
            features: ['parking']
          }
        }

        make_request(payload)
        expect(response).to have_http_status 400
        errors = JSON.parse(response.body)['errors']
        expect(errors).to eq [{ 'message' => 'No Spins remaining on your account. Please upgrade or contact us for assistance.' }]
      end

      it 'fails for unsupported output language' do
        payload = {
          output_language: "PK",
          text: {
            location: 'london',
            property_type: 'house',
            number_of_bedrooms: 1,
            ideal_for: 'couple',
            features: ['parking']
          }
        }

        make_request(payload)
        expect(response).to have_http_status 400
        errors = JSON.parse(response.body)['errors']
        expect(errors).to eq [{ 'message' => 'Language not supported. Only following output languages are supported: ["EN", "DA", "DE", "ES", "FR", "IT", "NL"]' }]
      end
    end
  end
end
