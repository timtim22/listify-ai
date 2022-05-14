class Inputs::PlaygroundAttempt < ApplicationRecord
  include Inputable

  self.table_name = 'playground_attempts'

  has_many :task_runs, as: :input_object, dependent: :destroy

  validates :request_type, :input_text, presence: true
  validates :input_text, length: { maximum: 1500 }

end
