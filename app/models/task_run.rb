class TaskRun < ApplicationRecord
  belongs_to :user
  belongs_to :prompt_set
  belongs_to :input_object, polymorphic: :true
  has_many :task_results, dependent: :destroy
  has_many :text_results, dependent: :destroy
  has_many :task_run_feedbacks, dependent: :destroy
  has_many :translation_requests, dependent: :destroy

  scope :today, -> { where(created_at: [DateTime.current.beginning_of_day..DateTime.current]) }

  def self.runs_remaining_today(user)
    user.runs_remaining_today
  end

  def has_all_results?
    task_results.count == expected_results
  end

  def task_result_count
    task_results.count
  end

  def output_language
    translation_requests&.first&.to
  end
end
