class Procedure < ApplicationRecord
  has_many :registered_steps, -> { order(position: :asc) }, dependent: :destroy

  def self.procedure_for(input_object)
    where(tag: input_object.inputable_type)
  end
end
