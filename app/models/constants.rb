module Constants
  def self.live_requests?
    Rails.env.production? || ENV['LIVE_REQUESTS'].present?
  end

  def self.live_requests_disabled?
    !live_requests?
  end
end
