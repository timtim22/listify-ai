class InputSnapshot
  class << self
    def for(input_object)
      case input_object.class.to_s
      when 'AreaDescription', 'Inputs::AreaDescriptionFragment' 
        area_inputs(input_object)
      when 'Inputs::BrandDescription'
        brand_inputs(input_object)
      else
        input_object.input_text
      end
    end

    def area_inputs(input_object)
      search_area = input_object.search_location_text.titleize
      "- search area: #{search_area}\n" + input_object.input_text
    end

    def brand_inputs(input_object)
      ignored_attrs = %w[id request_type created_at updated_at]
      attrs = input_object.attributes.except(*ignored_attrs)
      attrs
        .map { |k, v| "#{k}: #{v.instance_of?(String) ? v : v.join(', ')}" }
        .join("\n")
    end
  end
end
