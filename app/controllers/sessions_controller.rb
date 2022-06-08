class SessionsController < Devise::SessionsController
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
end
