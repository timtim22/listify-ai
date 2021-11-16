class LegacyPrompt < ApplicationRecord
  has_many :legacy_task_runs

  def self.for(task_type)
    LegacyPrompt.find_by(title: task_type, active: true)
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
end
