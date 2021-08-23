class Prompt < ApplicationRecord
  has_many :task_runs
  before_create :set_previous_version_inactive

  def self.for(task_type)
    Prompt.find_by(title: task_type, active: true)
  end

  def self.new_from_defaults
    self.new(
      stop: "\\n",
      max_tokens: 200,
      temperature: 0.0,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      engine: "davinci-instruct-beta",
      active: true
    )
  end

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

  private

  def construct_prompt_body(input_text)
    content.gsub("{input}", input_text)
  end

  def set_previous_version_inactive
    previous_version = Prompt.for(title)
    previous_version.update(active: false) if previous_version
  end
end
