require "swagger_helper"

describe 'api/v1/authentication_controller' do
  path '/api/v1/users/sign_in' do
    post 'Sign In' do
      tags 'Sign In'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :body, in: :body, description: 'User login parameter', schema: {
        type: :object,
        properties: {
          email: { type: :string, description: 'User email', example: 'test@test.com' },
          password: { type: :string, description: 'User password', example: '12345678' }
        },
        required: ['email', 'password']
      }

      let(:user) do
        create(:user)
      end

      response '200', 'Successfully logged In' do
        let(:email) { user.email }
        let(:password) { user.password }
        run_test!
      end

      response '400', 'Email and Password are required field.' do
        let(:email) { 'test@test.com' }
        run_test!
      end

      response '404', 'Incorrect Email' do
        let(:email) { 'test' }
        let(:password) { user.password }
        run_test!
      end
    end
  end
end
