class AreaDescription::Restaurant
  attr_reader :unsorted_restaurants, :counts, :restaurants

  def initialize(restaurants, counts)
    @unsorted_restaurants = restaurants
    @restaurants = restaurants_by_type
    @counts      = counts
  end

  def restaurants_by_type
    sorted = { cafes: [], restaurants: [], takeaways: [], other: [] }
    unsorted_restaurants.each do |r|
      if category_of(r, "spa")
        sorted[:other] << r
      elsif category_of(r, "cafe")
        sorted[:cafes] << r
      elsif category_of(r, "meal_takeaway")
        sorted[:takeaways] << r
      else
        sorted[:restaurants] << r
      end
    end
    sorted
  end

  def category_of(attraction, category)
    attraction.categories.include?(category)
  end

  def all_in_category?(attractions, category)
    attractions.all? { |a| category_of(a, category) }
  end

  def selected(place_type)
    restaurants[place_type].count
  end

  def string
    other_string(restaurants[:other]) +
    restaurant_string(restaurants[:restaurants]) +
    takeaway_string(restaurants[:takeaways])
  end

  def other_string(others)
    if others.count == 0
      ""
    elsif category_of(others.first, "spa") && others.first.name.downcase.include?(" spa ")
      [
        "To fully unwind, you can visit #{others.first.name}. ",
        "For a day of relaxation, go to #{others.first.name}. "
      ].sample
    else
      ""
    end
  end

  def restaurant_string(restaurants)
    case restaurants.count
    when 0 then ""
    when 1 then single_restaurant_string(restaurants)
    when 2 then double_restaurant_string(restaurants)
    when 3 then triple_restaurant_string(restaurants)
    else
      multiple_restaurant_string(restaurants)
    end
  end

  def single_restaurant_string(restaurants)
    [
      "Head to #{restaurants.first.name} for food or a drink. ",
      "For dining out, #{restaurants.first.name} is also nearby. ",
      "#{restaurants.first.name} is also worth a visit. "
    ].sample
  end

  def double_restaurant_string(restaurants)
    if restaurants.any? { |r| category_of(r, "bar") }
      [
        "Bars and restaurants to try are #{restaurants.first.name}, and #{restaurants.second.name}. ",
        "When you want an evening out, #{restaurants.first.name} and #{restaurants.second.name} are also nearby. "
      ].sample
    else
      [
        "For dining out, #{restaurants.first.name} and #{restaurants.second.name} are also nearby. ",
        "When you want an evening out, #{restaurants.first.name} and #{restaurants.second.name} are also nearby. ",
        "Local eateries include #{restaurants.first.name} and #{restaurants.second.name}. ",
      ].sample
    end
  end

  def triple_restaurant_string(restaurants)
    if restaurants.any? { |r| category_of(r, "bar") }
      [
        "There are a number of great bars and restaurants, including #{restaurants.first.name}, #{restaurants.second.name}, and #{restaurants.third.name}. ",
        "There is a range of bars and restaurants to choose from, including #{restaurants.first.name}, #{restaurants.second.name}, and #{restaurants.third.name}. ",
        "Bars and restaurants to try are #{restaurants.first.name}, #{restaurants.second.name}, and #{restaurants.third.name}. "
      ].sample
    else
      [
        "There are great options for dining out including #{restaurants.first.name}, #{restaurants.second.name}, and #{restaurants.third.name}. ",
        "When you don't want to cook, there is #{restaurants.first.name}, #{restaurants.second.name}, and #{restaurants.third.name}. "
      ].sample
    end
  end

  def multiple_restaurant_string(restaurants)
    [
      "There are great options for dining out including #{restaurants.first.name}, #{restaurants.second.name}, and #{restaurants.third.name}. ",
      "There are a range of great food and drink options, such as #{restaurants.first.name}, #{restaurants.third.name} and #{restaurants.second.name}. "
    ].sample
  end

  def takeaway_string(takeaways)
    case takeaways.count
    when 0 then ""
    when 1 then single_takeaway_string(takeaways)
    when 2 then double_takeaway_string(takeaways)
    else
      triple_takeaway_string(takeaways)
    end
  end

  def single_takeaway_string(takeaways)
    [
      "#{takeaways.first.name} is a fantastic option for a takeaway. ",
      "#{takeaways.first.name} is a very good takeaway. ",
      "#{takeaways.first.name} is an excellent takeaway. ",
      "For a top takeaway option, there is  #{takeaways.first.name}. "
    ].sample
  end

  def double_takeaway_string(takeaways)
    [
      "Takeaways include #{takeaways.first.name} and #{takeaways.second.name}. ",
      "Local takeaway options include #{takeaways.first.name} and #{takeaways.second.name}. "
    ].sample
  end

  def triple_takeaway_string(takeaways)
    "When you want to stay in, #{takeaways.first.name}, #{takeaways.second.name} and #{takeaways.third.name} all offer a takeaway service. "
  end

  def nearby(attraction_type)
    counts[attraction_type]
  end
end
