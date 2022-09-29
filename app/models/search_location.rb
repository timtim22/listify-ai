class SearchLocation < ApplicationRecord
  has_many :recorded_searches, dependent: :destroy
  has_many :area_descriptions, dependent: :destroy
  has_many :area_description_fragments, class_name: 'Inputs::AreaDescriptionFragment', dependent: :destroy

  attr_accessor :attraction_radius

  validates :search_text, length: { minimum: 3 }

  def self.find_or_create_with(search_text)
    if Rails.env.production? || ENV['LIVE_REQUESTS']
      search_location = find_or_create_by(search_text: search_text)
      if search_location.valid?
        search_location.set_coordinates if !search_location.latitude
      end
    else
      search_location = find_or_create_by(AreaSearch::MockData.new.search_params)
    end
    search_location
  end

  def set_coordinates
    AreaSearch::Geocoder.set_coordinates(self)
  end
end
