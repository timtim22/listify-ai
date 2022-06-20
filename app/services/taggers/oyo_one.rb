module Taggers
  class OyoOne
    def prompt_for(obj)
      strings = [
        "#{obj.property_type}#{obj.location.present? ? " in #{obj.location}" : ''}",
        obj.location_detail,
        "ideal for #{obj.target_user}",
        obj.usp_one,
        obj.usp_two,
        obj.usp_three
      ].compact_blank

      "- #{strings.join("\n- ")}"
    end

    def tags_for(obj)
      Taggers::CommonMethods.tags_for(obj, 'oyo_one')
    end
  end
end
