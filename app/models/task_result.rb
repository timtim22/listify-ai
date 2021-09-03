class TaskResult < ApplicationRecord
  belongs_to :task_run
  belongs_to :prompt
end
