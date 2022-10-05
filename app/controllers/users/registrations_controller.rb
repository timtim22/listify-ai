class Users::RegistrationsController < Devise::RegistrationsController
  def create
    if passes_recaptcha?
      super
      return if resource.invalid?

      team_invitation = TeamInvitation.find_by(email: resource.email)
      if team_invitation.present? && !team_invitation.expired?
        team = team_invitation.team
        team.send("add_#{team_invitation.role}", resource.email)
        team_invitation.accepted!
      end
      UserMailer.welcome(resource).deliver_now
    else
      redirect_to new_user_registration_path, alert: 'Failed recaptcha - if this persists please contact hello@listify.ai for support'
    end
  end

  private

  def passes_recaptcha?
    verified = ApiClients::Recaptcha.new.verify_response(params['g-recaptcha-response'])
    verified['success']
  end
end
