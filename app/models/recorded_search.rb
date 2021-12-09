class RecordedSearch < ApplicationRecord
  belongs_to :search_location
  belongs_to :user
end
