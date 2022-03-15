class ListingFragment < ApplicationRecord
  include Inputable

  has_many :task_runs, as: :input_object, dependent: :destroy
  has_many :task_results, through: :task_runs
  belongs_to :full_listing, class_name: 'Legacy::FullListing'

  validates :request_type, :input_text, presence: true

  def result
    task_results.first
  end

  def requests_completed?
    task_runs.all?(&:has_all_results?)
  end
end
