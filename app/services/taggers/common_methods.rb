module Taggers
  module CommonMethods
    def self.tags_for(obj, input_structure)
      tags = []
      rules = Taggers::Rule.where(input_structure: input_structure)
      rules.each do |rule|
        rule.applicable_fields.each do |field|
          next unless obj.respond_to?(field)

          tags << rule.tag if matches_rule_keywords(obj, rule, field)
        end
      end
      tags.uniq
    end

    def self.matches_rule_keywords(obj, rule, field)
      rule.keywords.any? do |keyword|
        val = obj.public_send(field.to_sym)
        val.present? && val.downcase.include?(keyword)
      end
    end
  end
end
