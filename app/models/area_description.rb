class AreaDescription < ApplicationRecord
  include Inputable

  belongs_to :search_location
  has_many :task_runs, as: :input_object, dependent: :destroy
  validates :request_type, presence: true

  def self.new_from(params)
    AreaDescription.new(
      request_type: "area_description",
      search_location: SearchLocation.find(params[:search_location_id]),
      input_data: {
        search_results: params[:search_results],
        selected_ids: params[:selected_ids]
      }.to_json
    )
  end

  def displayable_input_text
    "Search: #{search_location.search_text}\n----\n" +
    input_text
  end

  def input_text
    categories = {}
    lines = []
    selected_attractions.each do |key, attractions|
      if attractions.any?
         attractions.map do |a|
         category = category_for(a, key)
         if categories[category].nil?
           categories[category] = [a]
         else
           categories[category] << a
          end
        end
      end
    end
    categories.each do |key, attractions|
      lines << "#{key}: #{attractions.map { |a| string_for(a) }.join(", ")}"
    end
    lines.join("\n").gsub("&", "and")
  end

  def string_for(attraction)
    if attraction.distance.nil?
      attraction.name
    elsif attraction.distance["duration"] < 15
      "#{attraction.name} (#{attraction.distance["duration"]} minutes walk)"
    else
      "#{attraction.name} (#{attraction.distance["distance"]} km)"
    end
  end

  def category_for(a, original_key)
    if a.categories.include?("spa")
      "spas"
    elsif original_key == :restaurants && a.categories.include?("cafe")
      "cafes"
    elsif original_key == :restaurants && a.categories.include?("meal_takeaway")
      "takeaways"
    elsif original_key == :restaurants
      "restaurants and bars"
    else
      original_key.to_s
    end
  end

  def inputs
    parsed = JSON.parse(input_data)
    {
      search_results: parsed["search_results"],
      selected_ids: parsed["selected_ids"]
    }
  end

  def selected_attractions
    selected = {}
    inputs[:search_results].each do |key, results|
      selected[key.to_sym] = []
      results.each do |result|
        if inputs[:selected_ids].include?(result["place_id"])
          selected[key.to_sym] << Attraction.from_hash(result)
        end
      end
    end
    selected
  end

  def result_counts
    counts = {}
    inputs[:search_results].each do |key, results|
      counts[key] = results.length
    end
    counts
  end
end
