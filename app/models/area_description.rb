class AreaDescription < ApplicationRecord
  include Inputable

  has_many :task_runs, as: :input_object, dependent: :destroy
  validates :request_type, presence: true

  def self.new_from(*args)
    AreaDescription.new(
      request_type: "area_description",
      input_data: {
        search_results: args.first["search_results"],
        selected_ids: args.first["selected_ids"]
      }.to_json
    )
  end

  def input_text
    lines = []
    selected_attractions.each do |key, attractions|
      if attractions.any?
        lines << "#{input_key(key)}: #{attractions.map(&:name).join(", ")}"
      end
    end
    lines.join("\n")
  end

  def input_key(key)
    key == :restaurants ? "restaurants, bars and other attractions" : key.to_s
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
