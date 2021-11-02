class AreaDescriptionGenerator
  attr_reader :attractions, :stations, :restaurants

  def initialize(attractions)
    @attractions = attractions[:attractions]
    @stations = attractions[:stations]
    @restaurants = attractions[:restaurants]
  end

  def run!
    attractions_string + station_string + restaurants_string
  end

  def attractions_string
    if attractions.count == 1
      "You will be near to #{attractions.first.name}. "
    elsif attractions.count == 2
      "You will be near to #{attractions.first.name} and #{attractions.second.name}. "
    elsif attractions.count == 3
      "You will be near to #{attractions.first.name}, #{attractions.second.name}, and #{attractions.third.name}. "
    end
  end

  def station_string
    if stations.count == 0
      "There are no stations nearby. "
    elsif stations.count == 1
      distance = distance_substring(stations.first)
      "The nearest station, #{stations.first.name}, is #{distance} away. "
    elsif stations.count == 2
      "#{stations.first.name} is #{distance_substring(stations.first)} and #{stations.second.name} is #{distance_substring(stations.second)} away. "
    elsif stations.count == 3
      "#{stations.first.name} is #{distance_substring(stations.first)}, #{stations.second.name} is #{distance_substring(stations.second)}, and #{stations.third.name} is #{distance_substring(stations.third)} away. "
    end
  end

  def restaurants_string
    if restaurants.count == 0
      ""
    elsif restaurants.count == 1
      "For dining out, #{restaurants.first.name} is nearby. "
    elsif restaurants.count == 2
      "For dining out, #{restaurants.first.name} and #{restaurants.second.name} are nearby. "
    elsif restaurants.count == 3
      "For dining out, #{restaurants.first.name}, #{restaurants.second.name}, and #{restaurants.third.name} are nearby. "
    elsif restaurants.count == 4 || restaurants.count == 5
      "There are a number of restaurants and places to go out nearby. "
    elsif restaurants.count > 6
      "There are plenty of restaurants and places to go for a drink nearby. "
    end
  end

  def distance_substring(attraction)
    attraction.distance[:duration] < 15 ? "#{attraction.distance[:duration]} minutes walk" : "#{attraction.distance[:distance]} km"
  end


  #[#<AttractionFinder::Attraction:0x00007fe9140d22f8
  #@categories=["train_station", "transit_station", "point_of_interest", "establishment"],
  #@distance={:distance=>"2.1 km", :duration=>"26 mins"},
  #@location={"lat"=>51.4119797, "lng"=>-0.1229958},
  #@name="Norbury",
  #@place_id="ChIJ3Q_nlpQGdkgRrL4UFVURetA",
  #@total_ratings=58>,
 ##<AttractionFinder::Attraction:0x00007fe9140d22d0
  #@categories=["train_station", "transit_station", "point_of_interest", "establishment"],
  #@distance={:distance=>"0.8 km", :duration=>"10 mins"},
  #@location={"lat"=>51.41870639999999, "lng"=>-0.1360554},
  #@name="Streatham Common",
  #@place_id="ChIJNa8hwogGdkgRm609dxMlvcs",
  #@total_ratings=49>,
 ##<AttractionFinder::Attraction:0x00007fe9140d2280
  #@categories=["train_station", "transit_station", "point_of_interest", "establishment"],
  #@distance={:distance=>"1.4 km", :duration=>"18 mins"},
  #@location={"lat"=>51.4259371, "lng"=>-0.1312823},
  #@name="Streatham",
  #@place_id="ChIJ6xD_foMGdkgRXQgwWtrcxak",
  #@total_ratings=46>]

end
