class SearchLocation < ApplicationRecord
  has_many :area_descriptions, dependent: :destroy
  validates :search_text, length: { minimum: 3 }

  def self.find_or_create_with(search_text)
    if Rails.env.development?
      search_location = find_or_create_by(MockData.new.search_params)
    else
      search_location = find_or_create_by(search_text: search_text)
      if search_location.valid?
        search_location.set_coordinates if !search_location.latitude
      end
    end
    search_location
  end

  def set_coordinates
    Geocoder.set_coordinates(self)
  end
end
