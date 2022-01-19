class ApplicationController < ActionController::Base
  include Pagy::Backend
  before_action :configure_permitted_parameters, if: :devise_controller?
  rescue_from Errors::ShortRequest, with: :render_error_response

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:promotion_code, :early_access_code])
  end

  def authenticate_admin
    redirect_to '/', alert: 'Not authorized.' unless user_signed_in? && current_user.admin?
  end

  def render_error_response(error)
    render json: { message: error.message }, status: error.http_status
  end

  def after_sign_out_path_for(resource_or_scope)
    new_user_session_path
  end
end
