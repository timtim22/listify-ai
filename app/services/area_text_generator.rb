class AreaTextGenerator

  class << self
    def input_text_for(area_description)
      attraction_lines = generate_attraction_lines(area_description)
      joined_lines_and_detail(attraction_lines, area_description.detail_text)
    end

    private

    def generate_attraction_lines(area_description)
      lines = []
      categories = sort_attractions_into_categories(area_description)
      categories.each do |category, attractions|
        lines << line_for_category(category, attractions)
      end
      lines
    end

    def joined_lines_and_detail(lines, detail_text)
      if detail_text.blank?
        "#{joined_lines(lines)}."
      else
        "#{joined_lines(lines)}\n#{detail_text}"
      end
    end

    def sort_attractions_into_categories(area_description)
      attraction_data = parse_attraction_data_for(area_description)
      categories = {}
      selected_attractions(attraction_data).each do |key, attractions|
        if attractions.any?
          attractions.map do |a|
            category = category_for(a, key)
            categories[category] = add_attraction_to_category(categories[category], a)
          end
        end
      end
    end

    def add_attraction_to_category(category, attraction)
      if category.nil?
        [attraction]
      else
        category << attraction
      end
    end

    def parse_attraction_data_for(area_description)
      parsed = JSON.parse(area_description.input_data)
      {
        search_results: parsed["search_results"],
        selected_ids: parsed["selected_ids"]
      }
    end

    def line_for_category(category, attractions)
      "#{category}: #{attractions.map { |a| string_for(a) }.join(", ")}"
    end

    def joined_lines(lines)
      "- #{lines.join("\n- ").gsub("&", "and")}"
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

    def selected_attractions(attraction_data)
      selected = {}
      attraction_data[:search_results].each do |key, results|
        selected[key.to_sym] = []
        results.each do |result|
          if attraction_data[:selected_ids].include?(result["place_id"])
            selected[key.to_sym] << Attraction.from_hash(result)
          end
        end
      end
      selected
    end
  end
end
