class ApplicationController < ActionController::Base

  def check_token
    auth_token = Rails.application.credentials.base_ext_token
    if request.headers['HTTP_AUTHORIZATION'] != auth_token
      raise "Token invalid!"
    end
  end

  def authenticate_admin
    redirect_to '/', alert: 'Not authorized.' unless user_signed_in? && current_user.admin?
  end
end
