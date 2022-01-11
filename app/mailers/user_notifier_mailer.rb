class UserNotifierMailer < ApplicationMailer
  default :from => 'Listify AI <luke@listify.ai>'

  def welcome(user)
    @user = user
    mail(
      :to => @user.email,
      :subject => 'Welcome to Listify!'
    )
  end
end
