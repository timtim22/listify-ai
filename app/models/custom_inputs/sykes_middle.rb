class CustomInputs::SykesMiddle < ApplicationRecord
  include Inputable

  has_many :task_runs, as: :input_object, dependent: :destroy

  after_create :generate_tags

  def generate_tags
    data = Taggers::Coordinate.for(request_type, attributes)
    update!(tags: data[:tags], input_text: data[:prompt])
  end
end

