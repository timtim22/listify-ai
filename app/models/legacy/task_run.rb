class Legacy::TaskRun < ApplicationRecord
  self.table_name = 'legacy_task_runs'

  belongs_to :user
  belongs_to :legacy_prompt, class_name: 'Legacy::Prompt'
end
