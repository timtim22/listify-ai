class TaskRun < ApplicationRecord
  belongs_to :user
  belongs_to :prompt
end
