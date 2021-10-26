class Geocoder
  def self.get_coordinates(search_location, client = GoogleClient.new)
    response = client.geocode_request(search_location.search_text)
    begin
      coordinates = response["results"][0]["geometry"]["location"]
      search_location.update!(
        latitude: coordinates["lat"],
        longitude: coordinates["lng"]
      )
    rescue StandardError => e
      puts e
    end
  end
end
