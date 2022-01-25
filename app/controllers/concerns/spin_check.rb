module SpinCheck
  extend ActiveSupport::Concern

  def self.runs_remaining(user)
    runs_remaining = user.runs_remaining_today
    raise Errors::UserAccountLocked if user.account_locked?
    raise Errors::NoSpinsRemaining if runs_remaining  <= 0
    runs_remaining
  end
end
