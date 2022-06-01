module Taggers
  class OyoThree
    def prompt_for(obj)
      strings = [
        obj.usp_one,
        obj.usp_two,
        obj.usp_three,
        obj.usp_four,
        obj.usp_five
       ].compact_blank

      "- #{strings.join("\n- ")}"
    end

    def tags_for(obj)
      Taggers::CommonMethods.tags_for(obj, 'oyo_three')
    end
  end
end

