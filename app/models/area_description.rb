class AreaDescription < ApplicationRecord
  include Inputable

  belongs_to :search_location
  has_many :task_runs, as: :input_object, dependent: :destroy

  attr_accessor :selected_ids

  validates :request_type, presence: true
  validates :detail_text, length: { minimum: 0, maximum: 300 }
  validates :selected_ids, length: { minimum: 1, too_short: 'No attractions were selected' }, on: :create

  def self.new_from(params)
    AreaDescription.new(
      request_type: "area_description",
      search_location: SearchLocation.find(params[:search_location_id]),
      detail_text: params[:detail_text],
      input_data: {
        search_results: params[:search_results],
        selected_ids: params[:selected_ids]
      }.to_json
    )
  end

  def displayable_input_text
    "Search: #{search_location.search_text.titleize}\n----\n" +
     AreaTextGenerator.input_text_for(self)
  end

  def input_text
    AreaTextGenerator.input_text_for(self)
  end

  def joined_lines_and_detail(lines, detail_text)
    joined_lines = "- #{lines.join("\n- ").gsub("&", "and")}"
    detail_text.blank? ? "#{joined_lines}." : "#{joined_lines}\n#{detail_text}"
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
end
