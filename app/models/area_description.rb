class AreaDescription
  include ActiveModel::Model

  attr_accessor :selected_ids, :search_results

  def generate
    AreaDescription::Generator.new(selected_attractions, result_counts).run!
  end

  def result_counts
    counts = {}
    search_results.each do |key, results|
      counts[key] = results.length
    end
    counts
  end

  def selected_attractions
    selected = {}
    search_results.each do |key, results|
      selected[key.to_sym] = []
      results.each do |result|
        if selected_ids.include?(result["place_id"])
          selected[key.to_sym] << Attraction.from_hash(result)
        end
      end
    end
    selected
  end
end
