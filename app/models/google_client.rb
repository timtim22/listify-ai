class GoogleClient
  KEY = Rails.application.credentials.dig(:google, :geocode_credentials, :api_key)

  GEOCODING_URL = "https://maps.googleapis.com/maps/api/geocode/json?"
  NEARBY_URL    = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?"
  DISTANCE_URL  = "https://maps.googleapis.com/maps/api/distancematrix/json?"

  def geocode_request(address)
    url = "#{GEOCODING_URL}address=#{address}&key=#{KEY}"
    request('get', url, {}, {})
  end

  def request(method, url, headers, body)
    response = HTTParty.send(method, *[url, {
      headers: headers,
      body: body,
      #debug_output: $stdout
    }])

    puts "Google RESPONSE"
    puts response
    puts "------"

    if response.code == 200
      JSON.parse(response.body)
    else
      { error: response.body, success: false }
    end
  end
end
