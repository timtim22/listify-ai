require 'rails_helper'

RSpec.describe 'Api::V1::Listings::TitlesController', type: :request do
  include RequestSpecHelper

  before(:each) do
    @user = create(:user)
    @user.update(admin: true)
  end

  describe 'descriptions controller' do
    context 'with invalid parameter' do
      it 'fails for missing parameter' do
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

        jwt_token = auth_token(@user)
        post '/api/v1/listings/descriptions', params: payload, headers: { Authorization: jwt_token }
        expect(response).to have_http_status 400
        expect(eval(response.body)[:message]).to eq [{ message: 'Required fields are as follows: property_type, ideal_for, location, number_of_bedrooms, features' }]
      end

      it 'fails for character count exceeding limit for location ' do
        payload = {
          output_language: "EN",
          text: {
            location: 'london london london london london london london london london london london',
            property_type: 'house',
            number_of_bedrooms: 2,
            ideal_for: 'couple',
            features: ['parking']
          }
        }

        jwt_token = auth_token(@user)
        post '/api/v1/listings/descriptions', params: payload, headers: { Authorization: jwt_token }
        expect(response).to have_http_status 400
        expect(eval(response.body)[:message]).to eq [{ message: 'location characters count should be less than 70' }]
      end

      it 'fails for character count exceeding limit for property_type ' do
        payload = {
          output_language: "EN",
          text: {
            location: 'london',
            property_type: 'house house house house house house house house house house house house',
            number_of_bedrooms: 2,
            ideal_for: 'couple',
            features: ['parking']
          }
        }

        jwt_token = auth_token(@user)
        post '/api/v1/listings/descriptions', params: payload, headers: { Authorization: jwt_token }
        expect(response).to have_http_status 400
        expect(eval(response.body)[:message]).to eq [{ message: 'property_type characters count should be less than 70' }]
      end

      it 'fails for character count exceeding limit for ideal_for' do
        payload = {
          output_language: "EN",
          text: {
            location: 'london',
            property_type: 'house',
            number_of_bedrooms: 2,
            ideal_for: 'couple couple couple couple couple couple couple couple couple couple couple couple',
            features: ['parking']
          }
        }

        jwt_token = auth_token(@user)
        post '/api/v1/listings/descriptions', params: payload, headers: { Authorization: jwt_token }
        expect(response).to have_http_status 400
        expect(eval(response.body)[:message]).to eq [{ message: 'ideal_for characters count should be less than 70' }]
      end

      it 'fails for unsupported output features' do
        payload = {
          output_language: "EN",
          text: {
            location: 'london',
            property_type: 'house',
            number_of_bedrooms: 1,
            ideal_for: 'couple',
            features: ['parking','parking','parking','parking','parking','parking','parking','parking','parking','parking',
              'parking','parking','parking', 'parking','parking','parking','parking',
              'parking','parking','parking','parking','parking','parking','parking','parking','parking','parking',
              'parking','parking','parking','parking','parking','parking','parking','parking','parking','parking',
              'parking','parking','parking','parking','parking','parking','parking','parking','parking','parking',
              'parking','parking','parking','parking','parking','parking','parking','parking','parking','parking',
              'parking','parking','parking','parking','parking','parking','parking','parking','parking','parking',
              'parking','parking','parking','parking','parking','parking','parking','parking','parking','parking',
              'parking','parking','parking','parking','parking','parking','parking','parking','parking','parking',
              'parking','parking','parking','parking','parking','parking','parking','parking','parking','parking',
              'parking','parking','parking','parking','parking','parking','parking','parking','parking','parking',
              'parking','parking','parking','parking','parking','parking','parking','parking','parking','parking',
              'parking','parking','parking','parking','parking','parking','parking','parking','parking','parking',
            ]
          }
        }

        jwt_token = auth_token(@user)
        post '/api/v1/listings/descriptions', params: payload, headers: { Authorization: jwt_token }
        expect(response).to have_http_status 400
        expect(eval(response.body)[:message]).to eq [{ message: 'features_count characters count should be less than 360' }]
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

        jwt_token = auth_token(@user)
        post '/api/v1/listings/descriptions', params: payload, headers: { Authorization: jwt_token }
        expect(response).to have_http_status 400
        expect(eval(response.body)[:message]).to eq [{ message: 'number_of_bedrooms should be between 0 and 100' }]
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

        jwt_token = auth_token(@user)
        post '/api/v1/listings/descriptions', params: payload, headers: { Authorization: jwt_token }
        expect(response).to have_http_status 400
        expect(eval(response.body)[:message]).to eq [{ message: 'number_of_bedrooms should be between 0 and 100' }]
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

        jwt_token = auth_token(@user)
        post '/api/v1/listings/descriptions', params: payload, headers: { Authorization: jwt_token }
        expect(response).to have_http_status 400
        expect(eval(response.body)[:message]).to eq [{ message: 'Language not supported. Only following output languages are supported: ["EN", "DA", "DE", "ES", "FR", "IT", "NL", "EN"]' }]
      end
    end
  end
end
