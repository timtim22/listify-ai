module Taggers
  class OyoOne

    PROP_TYPES = [
      'apartment',
      'bungalow',
      'cabin',
      'chalet',
      'cottage',
      'farmhouse',
      'flat',
      'holiday home',
      'house',
      'mansion',
      'studio',
      "shepherd's hut",
      'villa'
    ].freeze

    def prompt_for(obj)
      strings = [
        "#{obj.property_type}#{obj.location && " in #{obj.location}"}",
        obj.location_detail,
        "ideal for #{obj.target_user}",
        obj.usp_one,
        obj.usp_two,
        obj.usp_three
      ].compact_blank

      "- #{strings.join("\n- ")}"
    end

    def tags_for(obj)
      tags = []
      rules = Taggers::Rule.where(input_structure: 'oyo_one')
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
        val.present? && val.include?(keyword)
      end
    end
  end
end
