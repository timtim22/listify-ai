class Errors::UserAccountLocked < StandardError

  def http_status
    422
  end

  def type
    'error'
  end

  def code
    'user_account_locked'
  end

  def message
    "An internal error occurred with your account. Please contact support."
  end

  def to_hash
    {
      type: type,
      text: message,
      code: code
    }
  end
end
