# Old full listing, deprecated beginning of March - namespace as legacy soon
class Legacy::FullListing < ApplicationRecord
  self.table_name = 'full_listings'

  has_many :listing_fragments, dependent: :destroy
  has_many :translations, as: :translatable, dependent: :destroy
  belongs_to :user

  scope :today, -> { where(created_at: [DateTime.current.beginning_of_day..DateTime.current]) }

  def result_text
    if requests_completed?
      output_runs = TaskRun.with_results(task_run_ids)
      results = output_runs.map { |tr| tr.task_results.first }
      if no_request_errors?(results)
        good_result_text(results)
      else
        error_result_text(results)
      end
    else
      ""
    end
  end

  def good_result_text(results)
    results.map(&:result_text).map(&:strip).join("\n\n")
  end

  def error_result_text(results)
    "There was an error with this request. Please try again, or let us know if this keeps happening."
  end

  def no_request_errors?(results)
    results.all?(&:success)
  end

  def check_complete
    if task_run_ids.any? && TaskRun.find(task_run_ids).all?(&:has_all_results?)
      self.update!(requests_completed: true)
    end
  end
end
