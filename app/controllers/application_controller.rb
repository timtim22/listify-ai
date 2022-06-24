class ApplicationController < ActionController::Base
  include Pundit::Authorization
  include Pagy::Backend

  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :masquerade_user!

  rescue_from Errors::ShortRequest, with: :render_error_response
  rescue_from Errors::NoSpinsRemaining, with: :render_error_response
  rescue_from Errors::UserAccountLocked, with: :render_error_response
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: %i[terms_of_service promotion_code])
    devise_parameter_sanitizer.permit(:sign_in, keys: %i[otp_attempt])
  end

  def authenticate_admin
    user_not_authorized unless user_signed_in? && current_user.admin?
  end

  def user_not_authorized
    redirect_to '/', alert: 'Not authorized.'
  end

  def render_error_response(error)
    render json: { message: error.message }, status: error.http_status
  end

  def after_sign_out_path_for(resource_or_scope)
    new_user_session_path
  end
end
