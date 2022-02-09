class AdminMailerPreview < ActionMailer::Preview
  def welcome
    AdminMailer.welcome(User.first)
  end

  def subscription_activated
    AdminMailer.subscription_activated(Subscription.first.user, Plan.first.name)
  end

  def subscription_cancelled
    AdminMailer.subscription_cancelled(Subscription.first.user)
  end

  def subscription_swapped
    AdminMailer.subscription_swapped(Subscription.first.user, Plan.first.name)
  end

  def user_account_locked
    AdminMailer.user_account_locked(User.first)
  end
end
