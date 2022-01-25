class Errors::NoSpinsRemaining < StandardError

  def http_status
    422
  end

  def type
    'error'
  end

  def code
    'no_spins_remaining'
  end

  def message
    "An internal error occurred. Please contact support."
  end

  def to_hash
    {
      type: type,
      text: message,
      code: code
    }
  end
end
