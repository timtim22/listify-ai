class Writing < ApplicationRecord
  include Inputable

  has_many :task_runs, as: :input_object, dependent: :destroy

  validates :request_type, :input_text, presence: true
  validates :input_text, length: { minimum: 10, maximum: 300 }
end
