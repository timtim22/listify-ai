class UserMailer < ApplicationMailer

  def welcome(user)
    @user = user
    mail(
      to: @user.email,
      subject: 'Welcome to Listify AI!'
    )
    AdminMailer.welcome(@user).deliver_later
  end

  def trial_expiring_soon(user)
    @user = user
    mail(
      to: @user.email,
      subject: 'Your trial is almost over'
    )
  end

  def trial_expiring_today(user)
    @user = user
    mail(
      to: @user.email,
      subject: 'Your trial ends today'
    )
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

  def payment_received(user, charge)
    @user = user
    @charge = charge
    @plan_name = user.subscription.plan.name
    mail(
      to: @user.email,
      subject: 'Thank you for your Listify payment'
    )
  end

  def payment_action_required(user, payment_intent_id, subscription)
    @user = user
    @payment_intent = Stripe::PaymentIntent.retrieve(payment_intent_id)
    @subscription = subscription
    @plan_name = subscription.plan.name
    mail(
      to: @user.email,
      subject: 'Payment confirmation required'
    )
  end
end
