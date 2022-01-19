class UserMailerPreview < ActionMailer::Preview
  def welcome
    UserMailer.welcome(User.first)
  end

  def subscription_activated
    UserMailer.subscription_activated(Subscription.first.user)
  end

  def subscription_cancelled
    UserMailer.subscription_cancelled(Subscription.first.user, Subscription.first)
  end
end
