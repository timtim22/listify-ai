class Inputs::OtherRoomFragment < ApplicationRecord
  include Inputable

  self.table_name = "other_room_fragments"

  has_many :task_runs, as: :input_object, dependent: :destroy
  has_many :task_results, through: :task_runs

  validates :request_type, presence: true
  validates :input_text, length: { minimum: 3, message: 'room name is too short' }
end
