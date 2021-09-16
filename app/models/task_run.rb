class TaskRun < ApplicationRecord
  belongs_to :user
  belongs_to :prompt_set
  belongs_to :input_object, polymorphic: :true
  has_many :task_results, dependent: :destroy
  has_many :task_run_feedbacks, dependent: :destroy

  scope :today, -> { where(created_at: [DateTime.current.beginning_of_day..DateTime.current]) }

  USER_DAILY_RUN_LIMIT = 40

  def self.runs_remaining_today(user)
    if user.admin?
      USER_DAILY_RUN_LIMIT
    else
      USER_DAILY_RUN_LIMIT - runs_today(user)
    end
  end

  def self.runs_today(user)
    where(user: user).today.count
  end

  def task_result_count
    task_results.count
  end
end
