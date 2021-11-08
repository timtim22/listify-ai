class AreaDescription::Station
  attr_reader :stations, :counts

  def initialize(stations, counts)
    @stations = stations
    @counts   = counts
  end

  def string
   if nearby("stations") == 0
      no_station_string
    elsif nearby("stations") == 1 && stations.count == 1
      single_station_string(stations)
    elsif stations.count == 1
      single_selected_station_string(stations)
    elsif stations.count == 2
      double_station_string(stations)
    elsif stations.count == 3
      triple_station_string(stations)
    elsif stations.count > 3
      multiple_stations_string(stations)
    else
      ""
    end
  end

  def no_station_string
    ["", "", "Note that there are no train stations close to this location. "].sample
  end

  def single_station_string(stations)
    "The nearest station, #{stations.first.name}, is #{distance_substring(stations.first)} away. "
  end

  def single_selected_station_string(stations)
    [
      "For getting around, #{station_name(stations.first)} is #{distance_substring(stations.first)} away. ",
      "For transport, #{station_name(stations.first)} is #{distance_substring(stations.first)}. ",
      "#{station_name(stations.first)} is #{distance_substring(stations.first)} away. "
    ].sample
  end

  def double_station_string(stations)
    "#{stations.first.name} is #{distance_substring(stations.first)} and #{stations.second.name} is #{distance_substring(stations.second)} away. "
  end

  def triple_station_string(stations)
    [
      "#{stations.first.name} is #{distance_substring(stations.first)}, #{stations.second.name} is #{distance_substring(stations.second)}, and #{stations.third.name} is #{distance_substring(stations.third)} away. ",
      "There are excellent train links, with #{stations.first.name} #{distance_substring(stations.first)}, #{stations.second.name} #{distance_substring(stations.second)}, and #{stations.third.name} #{distance_substring(stations.third)} away. "
    ].sample
  end

  def multiple_stations_string(stations)
    [
      "#{stations.first.name} is #{distance_substring(stations.first)}, #{stations.second.name} is #{distance_substring(stations.second)}, and #{stations.third.name} is #{distance_substring(stations.third)} away. ",
      "There are excellent train links, with #{stations.first.name} #{distance_substring(stations.first)}, #{stations.second.name} #{distance_substring(stations.second)}, and #{stations.third.name} #{distance_substring(stations.third)} away. "
    ].sample
  end

  def station_name(station)
    if station.name.downcase.include?("station")
      station.name
    elsif station.categories.include?("light_rail_station")
      "#{station.name} stop"
    else
      "#{station.name} Station"
    end
  end

  def nearby(attraction_type)
    counts[attraction_type]
  end

  def distance_substring(attraction)
    attraction.distance["duration"] < 15 ? "#{attraction.distance["duration"]} minutes walk" : "#{attraction.distance["distance"]} km"
  end
end
