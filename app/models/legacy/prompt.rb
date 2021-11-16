class Legacy::Prompt < ApplicationRecord
  self.table_name = "legacy_prompts"

  has_many :legacy_task_runs, class_name: "Legacy::TaskRun", foreign_key: "legacy_prompt_id"

  def self.for(task_type)
    Legacy::Prompt.find_by(title: task_type, active: true)
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
