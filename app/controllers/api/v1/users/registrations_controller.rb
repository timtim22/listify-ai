class Api::V1::Users::RegistrationsController < Devise::RegistrationsController
  def create
    build_resource(sign_up_params)
    return user_already_exists if check_email_exist

    resource.save ? json_success('Signed up sucessfully.') : json_bad_request('Something went wrong.')
  end

  private

  def user_already_exists
    json_bad_request('Email already exist.')
  end

  def check_email_exist
    true if User.exists? email: params[:user][:email]
  end
end
