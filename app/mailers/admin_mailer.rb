class AdminMailer < ApplicationMailer
  def welcome(user)
    @user = user
    mail(
      :to => ['hello@listify.ai', 'srin@listify.ai'],
      :subject => 'New Listify user',
    )
  end

  def subscription_activated(user, plan_name)
    @user = user
    @plan_name = plan_name
    mail(
      :to => ['hello@listify.ai', 'srin@listify.ai'],
      :subject => 'New Listify subscription'
    )
  end

  def subscription_cancelled(user)
    @user = user
    mail(
      :to => ['hello@listify.ai', 'srin@listify.ai'],
      :subject => 'Cancelled Listify subscription'
    )
  end
end
