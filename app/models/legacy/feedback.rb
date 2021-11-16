class Legacy::Feedback < ApplicationRecord
  belongs_to :legacy_task_run, class_name: "Legacy::TaskRun"
end
