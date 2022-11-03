class Api::V1::Users::AuthenticationController < Api::V1::ApiController
  skip_before_action :authorize_request, only: :login
  before_action :required_params
  before_action :check_user_exist

  def login
    @user = User.find_by(email: params[:email])
    if @user.valid_password?(params[:password])
      token = JsonWebToken.encode(user_id: @user.id)
      time = Time.current + 24.hours.to_i
      json_success('Signed in successfully.', token: token, expires_at: time.strftime('%m-%d-%Y %H:%M'))
    else
      failed_auth_response
    end
  end

  private

  def check_user_exist
    failed_auth_response unless User.find_by(email: params[:email])

  end

  def failed_auth_response
    json_not_found('Could not authenticate. Please check your credentials and try again.')
  end

  def required_params
    json_bad_request('Email and password are required fields.') if params[:email].blank? || params[:password].blank?
  end
end
