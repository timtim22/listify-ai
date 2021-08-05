class ApplicationController < ActionController::Base

  def authenticate_admin
    redirect_to '/', alert: 'Not authorized.' unless user_signed_in? && current_user.admin?
  end
end
