module Taggers
  class OyoTwo
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
      tags = []
      rules = Taggers::Rule.where(input_structure: 'oyo_two')
      rules.each do |rule|
        rule.applicable_fields.each do |field|
          next unless obj.respond_to?(field)

          tags << rule.tag if matches_rule_keywords(obj, rule, field)
        end
      end
      tags.uniq
    end

    def matches_rule_keywords(obj, rule, field)
      rule.keywords.any? do |keyword|
        val = obj.public_send(field.to_sym)
        val.present? && val.downcase.include?(keyword)
      end
    end
  end
end
