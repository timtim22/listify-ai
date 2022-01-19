class RegistrationsController < Devise::RegistrationsController
  def create
    super
    UserMailer.welcome(resource).deliver_now unless resource.invalid?
  end
end
