class TaskRun < ApplicationRecord
  belongs_to :user
  belongs_to :prompt_set
  belongs_to :input_object, polymorphic: :true
  has_many :task_results, dependent: :destroy
end
