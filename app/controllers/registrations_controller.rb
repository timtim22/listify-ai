class RegistrationsController < Devise::RegistrationsController
  def create
    if passes_recaptcha?
      super
      UserMailer.welcome(resource).deliver_now unless resource.invalid?
    else
      redirect_to new_user_registration_path, alert: "Failed recaptcha - if this persists please contact hello@listify.ai for support"
    end
  end

  private
  def passes_recaptcha?
    verified = RecaptchaClient.new.verify_response(params['g-recaptcha-response'])
    verified["success"]
  end
end
