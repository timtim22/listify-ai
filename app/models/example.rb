class Example < ApplicationRecord
  before_save :generate_derived_data, if: :will_save_change_to_input_data?
  validates :request_type, presence: true
  validates :completion, length: { maximum: 1000 }

  def generate_derived_data
    data = Taggers::Coordinate.for(request_type, input_data)
    assign_attributes(tags: data[:tags], prompt: data[:prompt])
  end
end
