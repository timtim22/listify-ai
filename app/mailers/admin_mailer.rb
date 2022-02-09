class AdminMailer < ApplicationMailer
  ADMIN_EMAILS = ['hello@listify.ai', 'srin@listify.ai'].freeze

  def welcome(user)
    @user = user
    mail(
      to: ADMIN_EMAILS,
      subject: 'New Listify user'
    )
  end

  def subscription_activated(user, plan_name)
    @user = user
    @plan_name = plan_name
    mail(
      to: ADMIN_EMAILS,
      subject: 'New Listify subscription'
    )
  end

  def subscription_cancelled(user)
    @user = user
    mail(
      to: ADMIN_EMAILS,
      subject: 'Cancelled Listify subscription'
    )
  end

  def subscription_swapped(user, plan_name)
    @user = user
    @plan_name = plan_name
    mail(
      to: 'luke@listify.ai',
      subject: 'Changed Listify plan'
    )
  end

  def user_account_locked(user)
    @user = user
    mail(
      to: ADMIN_EMAILS,
      subject: 'User account locked!'
    )
  end
end
