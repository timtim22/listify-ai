class Users::RegistrationsController < Devise::RegistrationsController
  def create
    if passes_recaptcha?
      super
      return if resource.invalid?

      flash[:alert] = 'Your team invitation has expired - please ask your colleague to resend it.' unless add_to_team
      AdminMailer.welcome(resource).deliver_later
    else
      redirect_to new_user_registration_path, alert: 'Failed recaptcha - if this persists please contact hello@listify.ai for support'
    end
  end

  private

  def after_inactive_sign_up_path_for(_resource)
    new_confirmation_path(resource)
  end

  def add_to_team
    team_invitation = TeamInvitation.find_by(email: resource.email)
    return true if team_invitation.blank?
    return false if team_invitation.expired?

    team = team_invitation.team
    team.send("add_#{team_invitation.role}", resource.email)
    team_invitation.accepted!
    true
  end

  def passes_recaptcha?
    verified = ApiClients::Recaptcha.new.verify_response(params['g-recaptcha-response'])
    verified['success']
  end
end
