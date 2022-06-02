class RecordedSearch < ApplicationRecord
  belongs_to :search_location
  belongs_to :user

  def self.since(time)
    where('created_at > ?', time)
  end
end
