class AdminMailer < ApplicationMailer
  def welcome(user)
    @user = user
    mail(
      :to => 'hello@listify.ai',
      :subject => 'New Listify user'
    )
  end

  def subscription_activated(user, plan_name)
    @user = user
    @plan_name = plan_name
    mail(
      :to => 'hello@listify.ai',
      :subject => 'New Listify subscription'
    )
  end
end
