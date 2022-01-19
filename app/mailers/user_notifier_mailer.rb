class UserNotifierMailer < ApplicationMailer

  def welcome(user)
    @user = user
    mail(
      :to => @user.email,
      :subject => 'Welcome to Listify AI!'
    )
  end
end
