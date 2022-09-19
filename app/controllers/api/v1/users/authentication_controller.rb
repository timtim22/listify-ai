class Api::V1::Users::AuthenticationController < Api::V1::ApiController
  skip_before_action :authorize_request, only: :login
  before_action :required_params
  before_action :check_user_exist

  def login
    @user = User.find_by(email: params[:email])
    if @user.valid_password?(params[:password])
      token = JsonWebToken.encode(user_id: @user.id)
      time = Time.now + 24.hours.to_i
      json_success('Successfully Logged In.', token: token, expire_at: time.strftime('%m-%d-%Y %H:%M'))
    else
      json_not_found('Incorrect Password')
    end
  end

  private

  def check_user_exist
    json_not_found('Incorrect Email') unless User.find_by(email: params[:email])
  end

  def required_params
    json_bad_request('Email and Password are required field.') if params[:email].blank? || params[:password].blank?
  end
end
