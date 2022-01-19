class AdminMailerPreview < ActionMailer::Preview
  def welcome
    AdminMailer.welcome(User.first)
  end
end
