class TrialNotification

  def send_due!
    send_expiring_soon_notifications
    send_expiring_today_notifications
  end

  private

  def send_expiring_soon_notifications
    users_with_three_days_left.map { |user| notify_trial_expiring_soon(user) }
  end

  def send_expiring_today_notifications
    users_expiring_today.map { |user| notify_trial_expiring_today(user) }
  end

  def notify_trial_expiring_soon(user)
    UserMailer.trial_expiring_soon(user).deliver_later
  end

  def notify_trial_expiring_today(user)
    UserMailer.trial_expiring_today(user).deliver_later
  end

  def users_with_three_days_left
    users_on_trial.select do |user|
      user.trial_end_date == Time.zone.today + 3.days
    end
  end

  def users_expiring_today
    users_on_trial.select do |user|
      user.trial_end_date == Time.zone.today
    end
  end

  def users_on_trial
    @users_on_trial ||= User.includes(:subscriptions).select(&:on_trial?)
  end
end
