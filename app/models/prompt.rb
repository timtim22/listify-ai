class Prompt < ApplicationRecord
  belongs_to :prompt_set
  has_many :task_results

  acts_as_list scope: :prompt_set

  validates :title, :content, presence: :true

  def self.new_from_defaults
    self.new(
      stop: "\\n",
      max_tokens: 200,
      temperature: 0.0,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      engine: "davinci-instruct-beta"
    )
  end

  def generate_with(input_object)
    if self.gpt_model_id.present?
      to_object_with_model(input_object.input_text)
    else
      to_object_with_text(input_object.details)
    end
  end

  private

  def to_object_with_model(input_text)
    body = construct_prompt_body(input_text).gsub("\\n", "\n")
    OpenStruct.new(model: gpt_model_id, body: body)
  end

  def to_object_with_text(input_text)
    req   = ["stop", "max_tokens", "temperature", "top_p", "frequency_penalty", "presence_penalty", "engine"]
    attrs = attributes.select { |a| req.include? a }
    body  = construct_prompt_body(input_text)
    OpenStruct.new(attrs.merge(body: body))
  end

  def construct_prompt_body(input_text)
    content.gsub("{input}", input_text)
  end
end
