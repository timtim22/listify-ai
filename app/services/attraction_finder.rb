class AttractionFinder
  attr_reader :search_location, :client

  def initialize(search_location, client = GoogleClient.new)
    @search_location = search_location
    @client = client
  end

  def find!
    find_stations
  end

  def find_stations
    results = client.nearby_request(
      location: search_location,
      type: 'train_station',
      radius: 5000
    )
    names = results["results"].first(3).map { |r| r["name"] }
  end
end
