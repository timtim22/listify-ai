class UserNotifierMailer < ApplicationMailer
  default :from => 'luke@listify.ai'

  def welcome(user)
    @user = user
    mail(
      :to => @user.email,
      :subject => 'Welcome to Listify!' )
  end
end
