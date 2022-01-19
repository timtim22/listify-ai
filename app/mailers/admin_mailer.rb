class AdminMailer < ApplicationMailer
  def welcome(user)
    @user = user
    mail(
      :to => 'hello@listify.ai',
      :subject => 'New listify user'
    )
  end
end
