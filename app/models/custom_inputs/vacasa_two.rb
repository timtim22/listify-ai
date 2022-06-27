class CustomInputs::VacasaTwo < ApplicationRecord
  include Inputable
  include Taggable

  has_many :task_runs, as: :input_object, dependent: :destroy

  after_create :generate_tags

end
