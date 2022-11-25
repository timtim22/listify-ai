class Procedure < ApplicationRecord
  has_many :registered_steps, -> { order(position: :asc) }, dependent: :destroy
  has_many :task_results, -> { order(created_at: :asc) }, dependent: :destroy

  def self.procedure_for(input_object)
    where(tag: input_object.input.inputable_type)
  end
end
