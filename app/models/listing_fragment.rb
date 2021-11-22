class ListingFragment < ApplicationRecord
  include Inputable

  has_many :task_runs, as: :input_object, dependent: :destroy
  belongs_to :full_listing

  validates :request_type, :input_text, presence: true

  def result_text
    task_runs.first.task_results.first.result_text
  end

  def requests_completed?
    task_runs.all?(&:has_all_results?)
  end
end
