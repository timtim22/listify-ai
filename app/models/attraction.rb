class Attraction
  attr_reader :name, :classification, :categories, :rating, :total_ratings, :location, :place_id, :distance

  def self.from_remote_object(hash)
    Attraction.new(
      hash["name"],
      hash["search_type"],
      hash["types"],
      hash["rating"],
      hash["user_ratings_total"],
      hash.dig("geometry", "location") || hash["location"],
      hash["place_id"]
    )
  end

  def self.from_hash(hash)
    Attraction.new(
      hash["name"],
      hash["classification"],
      hash["categories"],
      hash["rating"],
      hash["total_ratings"],
      hash["location"],
      hash["place_id"],
      hash["distance"]
    )
  end

  def initialize(name, search_type, categories, rating, total_ratings, location, place_id, distance = nil)
    @name = name
    @categories = categories
    @rating = rating
    @total_ratings = total_ratings
    @location = location
    @place_id = place_id
    @classification = search_type
    @distance = distance
  end

  def set_distance(distance_obj)
    @distance = {
      distance: (distance_obj["distance"]["value"] / 1000.0).round(1),
      duration: (distance_obj["duration"]["value"] / 60.0).round
    }
  end
end
