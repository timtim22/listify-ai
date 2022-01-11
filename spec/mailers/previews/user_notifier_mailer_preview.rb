class UserNotifierMailerPreview < ActionMailer::Preview
  def welcome
    UserNotifierMailer.welcome(User.first)
  end
end
