class Procedure < ApplicationRecord
  has_many :registered_steps, -> { order(position: :asc) }, dependent: :destroy
  has_many :task_results, -> { order(created_at: :asc) }, dependent: :destroy

  validates :tag, presence: true
  validates :tag, uniqueness: true

  def self.procedure_for(input_object)
    where(tag: input_object.request_type)
  end
end
