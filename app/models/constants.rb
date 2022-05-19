module Constants
  def self.live_requests?
    Rails.env.production? || ENV['LIVE_REQUESTS'].present?
  end
end
