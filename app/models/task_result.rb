class TaskResult < ApplicationRecord
  belongs_to :task_run
  belongs_to :prompt
  has_many :content_filter_results, dependent: :destroy

  def filtered_result_text
    if safe?
      result_text
    else
      "This result was flagged as sensitive or unsafe. This may be a mistake - we are looking into it."
    end
  end

  def safe?
    !failed_custom_filter &&
    (content_filter_results.empty? || content_filter_results.all?(&:safe?))
  end

  def unsafe?
    !safe?
  end
end
