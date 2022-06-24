class Users::SessionsController < Devise::SessionsController

  def pre_otp
    user = User.find_by(pre_otp_params)
    @two_factor_enabled = user&.otp_required_for_login

    respond_to do |format|
      format.js
    end
  end

  def create
    if passes_recaptcha?
      super
    else
      redirect_to new_user_session_path, alert: 'Failed recaptcha - if this persists please contact hello@listify.ai for support'
    end
  end

  private

  def passes_recaptcha?
    verified = ApiClients::Recaptcha.new.verify_response(params['g-recaptcha-response'])
    verified['success']
  end

  def pre_otp_params
    params.require(:user).permit(:email)
  end
end
