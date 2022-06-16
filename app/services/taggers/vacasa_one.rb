module Taggers
  class VacasaOne
    def prompt_for(obj)
      strings = [
        "#{obj.property_type}#{obj.location.present? && " in #{obj.location}"}",
        obj.target_user.present? && "ideal for #{obj.target_user}",
        obj.usp_one,
        obj.usp_two,
        obj.usp_three,
        obj.usp_four,
        obj.usp_five
      ].compact_blank

      "- #{strings.join("\n- ")}"
    end

    def tags_for(obj)
      Taggers::CommonMethods.tags_for(obj, 'vacasa_one')
    end
  end
end

