class Geocoder
  def self.set_coordinates(search_location, client = GoogleClient.new)
    response = client.geocode_request(search_location.search_text)
    if response["status"] && response["status"] == "ZERO_RESULTS"
    else
      coordinates = response["results"][0]["geometry"]["location"]
      search_location.update!(
        latitude: coordinates["lat"],
        longitude: coordinates["lng"]
      )
    end
  end
end
