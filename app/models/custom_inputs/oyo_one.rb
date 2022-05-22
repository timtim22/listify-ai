class CustomInputs::OyoOne < ApplicationRecord
  include Inputable

  has_many :task_runs, as: :input_object, dependent: :destroy

  after_create :generate_tags

  def generate_tags
    update!(input_text: generate_input_text)
    Taggers::OyoOne.tag_object!(self, attributes)
  end

  def generate_input_text
    strings = [
      "#{property_type}#{location && " in #{location}"}",
      location_detail,
      "ideal for #{target_user}",
      usp_one,
      usp_two,
      usp_three
    ].compact_blank
    "- #{strings.join("\n- ")}"
  end
end
