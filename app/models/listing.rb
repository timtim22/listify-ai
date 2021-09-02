class Listing < ApplicationRecord
  belongs_to :user

  validates :user_id, :request_type, :property_type, :sleeps,
    :location, presence: true

  #def save
    #return false if !valid?
    #true
  #end

  #def input_text
    #input_text_for[request_type]
  #end
end
