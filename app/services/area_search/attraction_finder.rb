module AreaSearch
  class AttractionFinder
    attr_reader :search_location, :client
    attr_accessor :found

    def initialize(search_location, client = ApiClients::GoogleMaps.new)
      @search_location = search_location
      @client = client
      @found = { attractions: [], stations: [], restaurants: [] }
    end

    def find!
      if Rails.env.production? || ENV['LIVE_REQUESTS']
        find_attractions
        find_stations
        find_restaurants
        found
      else
        AreaSearch::MockData.new.london
      end
    end

    def find_attractions
      results = nearby_request('tourist_attraction', 5000)
      found[:attractions] = filter_by_ratings(results) if results.any?
    end

    def find_stations
      get_train_stations('train_station', 3)
      get_train_stations('light_rail_station', 2) if found[:stations].count.zero?
      get_subway_stations('subway_station', 2)
      sort_stations_by_distance
    end

    def get_train_stations(station_type, record_count = 3)
      results = nearby_request(station_type, 5000)
      results_with_distance(results, record_count)
    end

    def get_subway_stations(station_type, record_count = 3)
      results = nearby_distance_request(station_type, 5000)
      results_with_distance(results, record_count)
    end

    def sort_stations_by_distance
      unique_stations = found[:stations].uniq(&:place_id)
      found[:stations] = sorted_by_distance(unique_stations)
    end

    def results_with_distance(results, record_count)
      return unless results.any?

      top_results = results.first(record_count)
      results_with_distance = distance_request(top_results)
      results_with_distance.map { |s| found[:stations] << s }
    end

    def sorted_by_distance(objects)
      if all_have_distance?(objects)
        objects.sort_by! { |s| s.distance[:distance] }
      else
        objects
      end
    end

    def all_have_distance?(objects)
      objects.all? { |obj| obj.distance.present? }
    end

    def find_restaurants
      results = nearby_request('restaurant', 2000)
      return if results.none?

      filtered = filter_by_ratings(results)
      if filtered.count < 3
        filtered << find_bars
        filtered = filtered.flatten.uniq(&:place_id)
      end
      found[:restaurants] = filtered
    end

    def find_bars
      bars = nearby_request('bar', 2000)
      filter_by_ratings(bars)
    end

    def filter_by_ratings(attractions)
      with_ratings = attractions.select { |r| r.total_ratings && r.total_ratings > 10 }
      with_ratings.sort_by(&:total_ratings).reverse
    end

    def distance_request(attractions)
      response = client.distance_request(
        location: search_location,
        attractions: attractions
      )
      elements = response['rows'][0]['elements']
      if distance_elements_found?(elements)
        elements&.map&.with_index do |distance, index|
          attractions[index].set_distance(distance)
        end
      end
      attractions
    end

    def distance_elements_found?(elements)
      !(elements[0].keys == ['status'] && elements[0]['status'].downcase == 'zero_results')
    end

    def nearby_request(type, radius)
      response = client.nearby_request(
        location: search_location,
        type: type,
        radius: radius
      )
      attractions_from(response, type)
    end

    def nearby_distance_request(type, radius)
      response = client.nearby_distance_request(
        location: search_location,
        type: type,
        radius: radius
      )
      attractions_from(response, type)
    end

    def attractions_from(response, search_type)
      response['results'].map do |result|
        result_with_search_type = result.merge({ 'search_type' => search_type })
        Attraction.from_remote_object(result_with_search_type)
      end
    end
  end
end
