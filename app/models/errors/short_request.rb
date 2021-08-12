class Errors::ShortRequest < StandardError

  def http_status
    422
  end

  def type
    'error'
  end

  def code
    'short_request'
  end

  def message
    "Oops, I need at least 6 words to work with. I'm sorry if I missed part of what you said."
  end

  def to_hash
    {
      type: type,
      text: message,
      code: code
    }
  end

end

