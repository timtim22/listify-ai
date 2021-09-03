class Listing < ApplicationRecord
  include Inputable

  has_many :task_runs, as: :input_object, dependent: :destroy

  validates :request_type, :property_type, :sleeps,
    :location, presence: true
end
