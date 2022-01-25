module SpinCheck
  extend ActiveSupport::Concern

  def self.runs_remaining(user)
    runs_remaining = user.runs_remaining_today
    if runs_remaining  <= 0
      raise Errors::NoSpinsRemaining
    end
    runs_remaining
  end
end
