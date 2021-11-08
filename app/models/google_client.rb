class GoogleClient
  KEY = Rails.application.credentials.dig(:google, :geocode_credentials, :api_key)

  GEOCODING_URL = "https://maps.googleapis.com/maps/api/geocode/json?"
  NEARBY_URL    = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?"
  DISTANCE_URL  = "https://maps.googleapis.com/maps/api/distancematrix/json?"
  REQUEST_CAP   = 12

  attr_accessor :request_count

  def initialize
    @request_count = 0
  end

  def geocode_request(address)
    url = "#{GEOCODING_URL}address=#{address}&key=#{KEY}"
    request('get', url, {}, {})
  end

  def nearby_request(location:, type: nil, radius: nil)
    url = base_location_url(location, type)
    url += "&radius=#{radius}" if radius
    request('get', url, {}, {})
  end

  def nearby_distance_request(location:, type: nil, radius: nil)
    url = base_location_url(location, type)
    url += "&rankby=distance"
    request('get', url, {}, {})
  end

  def distance_request(location:, attractions:)
    origin_str = "origins=#{location_string(location)}"
    destination_str = "destinations=#{destinations_string(attractions)}"
    url = "#{DISTANCE_URL}&#{origin_str}&#{destination_str}&mode=walking&key=#{KEY}"
    request('get', url, {}, {})
  end

  def base_location_url(location, type)
    url  = "#{NEARBY_URL}location=#{location_string(location)}&key=#{KEY}"
    url += "&type=#{type}" if type
    url
  end

  def location_string(location)
    "#{location.latitude}%2C#{location.longitude}"
  end

  def destinations_string(attractions)
    "place_id:#{attractions.map(&:place_id).join("%7Cplace_id:")}"
  end

  def raise_error_if_possible_loop
    @request_count += 1
    raise "Possible loop detected!" if request_count > 15
  end

  def request(method, url, headers, body)
    raise_error_if_possible_loop

    response = HTTParty.send(method, *[url, {
      headers: headers,
      body: body,
      #debug_output: $stdout
    }])

    if response.code == 200
      JSON.parse(response.body)
    else
      { error: response.body, success: false }
    end
  end
end
