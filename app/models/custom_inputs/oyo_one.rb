class CustomInputs::OyoOne < ApplicationRecord
  include Inputable

  has_many :task_runs, as: :input_object, dependent: :destroy
end
