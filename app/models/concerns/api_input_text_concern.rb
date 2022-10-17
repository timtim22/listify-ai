module ApiInputTextConcern
  extend ActiveSupport::Concern

  def params_input_text(bedrooms, location, property_type, ideal_for, feature_array)
    bedrooms = "- #{bedrooms}"
    location = "#{location}\n"
    property_type = " #{property_type}"
    ideal_for = "#{ideal_for}\n- "
    join_feature_array = feature_array.join(" \n-")

    if property_type.downcase.split.include? 'studio'
      "-" + property_type + " in " + location + "- ideal for " + ideal_for + join_feature_array + "."
    else
      bedrooms + " bedroom" + property_type + " in " + location + "- ideal for " + ideal_for + join_feature_array + "."
    end
  end
end
