class PlaygroundAttempt < ApplicationRecord
  include Inputable

  has_many :task_runs, as: :input_object, dependent: :destroy

  validates :request_type, :input_text, presence: true
  validates :input_text, length: { maximum: 500 }

end
