class TaskResult < ApplicationRecord
  belongs_to :task_run
  belongs_to :prompt, optional: true
  has_many :content_filter_results, dependent: :destroy
  has_many :translations, as: :translatable, dependent: :destroy

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

  def awaiting_translation?
    task_run.translation_requests.count > self.translations.count
  end
end
