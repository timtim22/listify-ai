class UserMailerPreview < ActionMailer::Preview
  def welcome
    UserMailer.welcome(User.first)
  end

  def subscription_activated
    UserMailer.subscription_activated(Subscription.first.user)
  end
end
