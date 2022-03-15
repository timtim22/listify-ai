class Legacy::Prompt < ApplicationRecord
  self.table_name = 'legacy_prompts'

  has_many :legacy_task_runs, class_name: 'Legacy::TaskRun', foreign_key: 'legacy_prompt_id'
end
