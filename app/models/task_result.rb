class TaskResult < ApplicationRecord
  belongs_to :task_run
  belongs_to :prompt
  has_many :content_filter_results, dependent: :destroy
end
