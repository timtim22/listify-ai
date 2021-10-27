class AttractionFinder
  attr_reader :search_location, :client

  def initialize(search_location, client = GoogleClient.new)
    @search_location = search_location
    @client = client
  end

  def find!
    result = {}
    result[:attractions] = find_attractions
    result[:stations] = find_stations
    #result
    AreaDescriptionGenerator.new(result).run!
  end

  def find_attractions
    results = nearby_request('tourist_attraction', 5000)
    with_ratings = results.select { |r| r.total_ratings && r.total_ratings > 10 }
    by_ratings = with_ratings.sort_by { |r| r.total_ratings }.reverse
    puts by_ratings.inspect
    by_ratings
    #names = by_ratings.map { |r| "#{r.name}, #{r.categories.join(",")}, #{r.place_id}, #{r.location.to_s}, #{r.total_ratings}" }
  end

  def find_stations
    results = nearby_request('train_station', 5000)
    top_results = results.first(3)
    with_distance = distance_request(top_results).sort_by { |a| a.distance[:distance] }
    puts with_distance.inspect
    with_distance
    #obj = { stations: with_distance }
    #with_distance.map { |r| "#{r.name}, #{r.distance.to_s}" }
  end

  def distance_request(attractions)
    response = client.distance_request(
      location: search_location,
      attractions: attractions
    )
    response["rows"][0]["elements"].map.with_index do |distance, index|
      attractions[index].set_distance(distance)
    end
    attractions
  end

  def nearby_request(type, radius)
    response = client.nearby_request(
      location: search_location,
      type: type,
      radius: radius
    )
    response["results"].map { |r| generate_attraction(r) }
  end

  def generate_attraction(result)
    Attraction.new(
      result["name"],
      result["types"],
      result["user_ratings_total"],
      result["geometry"]["location"],
      result["place_id"]
    )
  end

  class Attraction
    attr_reader :name, :categories, :total_ratings, :location, :place_id, :distance

    def initialize(name, categories, total_ratings, location, place_id)
      @name = name
      @categories = categories
      @total_ratings = total_ratings
      @location = location
      @place_id = place_id
      @distance = nil
    end

    def set_distance(distance_obj)
      @distance = {
        distance: (distance_obj["distance"]["value"] / 1000.0).round(1),
        duration: (distance_obj["duration"]["value"] / 60.0).round
      }
    end
  end
end
