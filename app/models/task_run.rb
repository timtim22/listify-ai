class TaskRun < ApplicationRecord
  belongs_to :user
  belongs_to :prompt_set, optional: true
  belongs_to :input_object, polymorphic: true
  has_many :task_results, dependent: :destroy
  has_many :intermediate_results, dependent: :destroy
  has_many :text_results, dependent: :destroy
  has_many :translation_requests, dependent: :destroy
  has_many :recorded_completions, dependent: :nullify

  scope :today, -> { where(created_at: [DateTime.current.beginning_of_day..DateTime.current]) }

  def self.with_results(ids)
    where(id: ids).includes(:task_results)
  end

  def has_all_results?
    task_results.count == expected_results
  end

  def task_result_count
    task_results.count
  end

  def all_results_failed?
    task_results.none?(&:success)
  end

  def output_language
    translation_requests&.first&.to
  end
end
