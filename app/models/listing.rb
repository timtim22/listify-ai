class Listing < ApplicationRecord
  include Inputable

  has_many :task_runs, as: :input_object, dependent: :destroy

  validates :request_type, :details, presence: true
end
