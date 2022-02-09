class UserMailer < ApplicationMailer

  def welcome(user)
    @user = user
    mail(
      to: @user.email,
      subject: 'Welcome to Listify AI!'
    )
    AdminMailer.welcome(@user).deliver_later
  end

  def subscription_activated(user)
    @user = user
    @plan_name = user.subscription.plan.name
    mail(
      to: @user.email,
      subject: 'Your Listify subscription is active!'
    )
    AdminMailer.subscription_activated(@user, @plan_name).deliver_later
  end

  def subscription_cancelled(user, subscription)
    @user = user
    @subscription = subscription
    mail(
      to: @user.email,
      subject: 'Your Listify subscription is cancelled'
    )
    AdminMailer.subscription_cancelled(@user).deliver_later
  end

  def subscription_swapped(user)
    @user = user
    @plan_name = user.subscription.plan.name
    mail(
      to: @user.email,
      subject: 'Your Listify subscription has updated'
    )
    AdminMailer.subscription_swapped(@user, @plan_name).deliver_later
  end
end
