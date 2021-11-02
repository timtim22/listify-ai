class SearchLocation < ApplicationRecord

  def self.find_or_create_with(search_text)
    search_location = find_or_create_by(search_text: search_text)
    search_location.set_coordinates if !search_location.latitude
    search_location
  end

  def set_coordinates
    Geocoder.set_coordinates(self)
  end
end
