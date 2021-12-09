class RecordedSearch < ApplicationRecord
  belongs_to :search_location
  belongs_to :user

  has_many :area_descriptions, through: :search_location
end
