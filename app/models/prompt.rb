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


  def to_object_with(input_text)
    req = ["stop", "max_tokens", "temperature", "top_p", "frequency_penalty", "presence_penalty", "engine"]
    attrs = attributes.select { |a| req.include? a }
    OpenStruct.new(attrs.merge(body: "#{content}#{input_text}"))
  end

  private

  def set_previous_version_inactive
    previous_version = Prompt.for(title)
    previous_version.update(active: false) if previous_version
  end




  def self.tidy_grammar(text)
    OpenStruct.new(
      title: "tidy_grammar",
      body: "Convert the following text to standard British English:\n#{text}",
      stop: "\\n",
      max_tokens: 200,
      temperature: 0.0,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      engine: "davinci-instruct-beta"
    )
  end

  def self.bullet_list(text)
    OpenStruct.new(
      title: "bullet_list",
      body: "Convert the following text into a list:\n#{text}",
      stop: "\\n",
      max_tokens: 200,
      temperature: 0.0,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      engine: "davinci-instruct-beta"
    )
  end

  def self.experimental(text)
    OpenStruct.new(
      title: "experimental",
      body: "Convert the following text to standard South African English:\n#{text}",
      stop: "\\n",
      max_tokens: 200,
      temperature: 0.0,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      engine: "davinci-instruct-beta"
    )
  end
end
