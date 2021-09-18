class TaskRun < ApplicationRecord
  belongs_to :user
  belongs_to :prompt_set
  belongs_to :input_object, polymorphic: :true
  has_many :task_results, dependent: :destroy
  has_many :task_run_feedbacks, dependent: :destroy

  scope :today, -> { where(created_at: [DateTime.current.beginning_of_day..DateTime.current]) }

  def self.runs_remaining_today(user)
    user.runs_remaining_today
  end

  def task_result_count
    task_results.count
  end
end
