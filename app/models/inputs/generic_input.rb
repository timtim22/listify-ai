class Inputs::GenericInput < ApplicationRecord
  include Inputable

  self.table_name = 'generic_inputs'

  has_many :task_runs, as: :input_object, dependent: :destroy
  has_many :task_results, through: :task_runs

  validates :request_type, presence: true
end

