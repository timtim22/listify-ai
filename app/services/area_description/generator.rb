class AreaDescription::Generator
  attr_reader :attractions, :stations, :restaurants, :counts, :selected_attractions

  def initialize(attractions, counts)
    @selected_attractions = attractions
    @attractions = attractions[:attractions]
    @stations = attractions[:stations]
    @restaurants = attractions[:restaurants]
    @counts = counts
  end

  def run!
    attractions_string +
    AreaDescription::Station.new(stations, counts).string +
    restaurants_string
  end

  def attractions_string
    if attractions.count == 1
      single_attraction_string(attractions)
    elsif attractions.count == 2
      double_attraction_string(attractions)
    elsif attractions.count == 3
      triple_attraction_string(attractions)
    elsif attractions.count > 3
      multiple_attraction_string(attractions)
    end
  end

  def category_of(attraction, category)
    attraction.categories.include?(category)
  end

  def all_in_category?(attractions, category)
    attractions.all? { |a| category_of(a, category) }
  end

  def single_attraction_string(attractions)
    choices = [
      "You will be near to #{attractions.first.name}. ",
      "The property is in a great location for visiting #{attractions.first.name}. "
    ]
    if category_of(attractions.first, "museum")
      choices << single_museum_string([attractions.first])
    end
    choices.sample
  end

  def double_attraction_string(attractions)
    if all_in_category?(attractions, "park")
      double_park_string(attractions)
    elsif all_in_category?(attractions, "museum")
      double_museum_string(attractions)
    else
      [
        "This is a great location for #{attractions.first.name} and #{attractions.second.name}. ",
        "Attractions in this area include #{attractions.first.name} and #{attractions.second.name}. ",
        "This home is near to #{attractions.first.name} and #{attractions.second.name}. "
      ].sample
    end
  end

  def triple_attraction_string(attractions)
    choices = [
      "You will be near to #{attractions.first.name}, #{attractions.second.name}, and #{attractions.third.name}. ",
      "This area has plenty to keep you entertained. Attractions include #{attractions.first.name}, #{attractions.second.name}, and #{attractions.third.name}. ",
      "There is plenty to see and do in this location, including #{attractions.first.name}, #{attractions.second.name}, and #{attractions.third.name}. ",
    ]
    if attractions.first.rating > 100000
      choices << "This location is close to the famous #{attractions.first.name}, as well as #{attractions.second.name}, #{attractions.third.name} and more. "
    end
    choices.sample
  end

  def multiple_attraction_string(attractions)
    [
    "There is a real choice of activities from this location, including #{attractions.first.name}, #{attractions.second.name}, #{attractions.third.name} and #{attractions.fourth.name}. ",
    "This is a great location with plenty to see and do, including #{attractions.first.name}, #{attractions.second.name}, and #{attractions.third.name}. ",
    "You will be spoilt for choice here, with #{attractions.first.name}, #{attractions.second.name}, and #{attractions.third.name} all within a short distance. "
    ].sample
  end

  def single_museum_string(attractions)
    "If you enjoy museums, #{attractions.first.name} is easy to get to. "
  end

  def double_museum_string(attractions)
    "This is a great spot for museums, with #{attractions.first.name} and #{attractions.second.name} close by. "
  end

  def double_park_string(attractions)
    "There is plenty to explore outside, with #{attractions.first.name} and #{attractions.second.name} close by. "
  end

  def restaurants_string
    takeaways, not_takeaways = restaurants.partition { |r| category_of(r, "meal_takeaway") }
    if takeaways.count == restaurants.count
      takeaway_string(takeaways)
    else
      if not_takeaways.count == 0
        ""
      elsif not_takeaways.count == 1
        [
          "For dining out, #{not_takeaways.first.name} is also nearby. ",
          "#{not_takeaways.first.name} is also worth a visit. "
        ].sample
      elsif nearby("restaurants") == 2 && not_takeaways.count == 2
        "For dining out, #{not_takeaways.first.name} and #{not_takeaways.second.name} are also nearby. "
      elsif not_takeaways.count == 2
        [
          "For dining out, #{not_takeaways.first.name} and #{not_takeaways.second.name} are also nearby. ",
          "When you want an evening out, #{not_takeaways.first.name} and #{not_takeaways.second.name} are also nearby. ",
        ].sample
      elsif not_takeaways.count == 3
        "There are great options for dining out including #{not_takeaways.first.name}, #{not_takeaways.second.name}, and #{not_takeaways.third.name}. "
      elsif not_takeaways.count == 4 || not_takeaways.count == 5
        "There is a range of great food options, such as #{not_takeaways.first.name} and #{not_takeaways.second.name}. "
      elsif not_takeaways.count > 6
        "There are plenty of restaurants and places to go for a drink nearby. "
      end
    end
  end

  def takeaway_string(restaurants)
    if restaurants.count == 0
      ""
    elsif restaurants.count == 1
      "#{restaurants.first.name} is a fantastic option for a takeaway. "
    elsif restaurants.count == 2
      "There are local takeaway options including #{restaurants.first.name} and #{restaurants.second.name}. "
    elsif restaurants.count >= 3
      "When you want to stay in, #{restaurants.first.name}, #{restaurants.second.name} and #{restaurants.third.name} all offer a takeaway service. "
    end
  end

  def nearby(attraction_type)
    counts[attraction_type]
  end
end
