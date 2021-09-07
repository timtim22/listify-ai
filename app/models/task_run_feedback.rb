class TaskRunFeedback < ApplicationRecord
  belongs_to :user
  belongs_to :task_run
end
