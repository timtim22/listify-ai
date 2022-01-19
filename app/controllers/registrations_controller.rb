class RegistrationsController < Devise::RegistrationsController
  def create
    super
    UserMailer.welcome(resource).deliver unless resource.invalid?
  end
end
