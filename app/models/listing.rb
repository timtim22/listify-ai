class Listing < ApplicationRecord
  include Inputable

  has_many :task_runs, as: :input_object, dependent: :destroy

  validates :request_type, :input_text, presence: true
  validates :input_text, length: { minimum: 10, maximum: 300 }

  def displayable_input_text
    if input_language != "EN"
      "Original language: #{input_language}\nOriginal_text:\n #{untranslated_input_text}\n\nTranslated:\n#{input_text}"
    else
      input_text
    end
  end
end
