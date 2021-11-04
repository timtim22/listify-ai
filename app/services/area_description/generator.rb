class AreaDescription::Generator

  attr_reader :attractions, :stations, :restaurants, :counts, :selected_attractions

  def self.run!(task_run, area_description)
    result = self.new(
      area_description.selected_attractions,
      area_description.result_counts
    ).run!
    task_run.text_results.create(result_text: result)
  end

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
    AreaDescription::Restaurant.new(restaurants, counts).string
  end

  def attractions_string
    if attractions.count == 0
      ""
    elsif attractions.count == 1
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
        "Attractions in the area include #{attractions.first.name} and #{attractions.second.name}. ",
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
end
