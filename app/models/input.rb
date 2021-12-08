class Input < ApplicationRecord
  belongs_to :user
  delegated_type :inputable, types: %w[ Listing ListingFragment DerivedInputObject RoomDescription AreaDescription Writing PlaygroundAttempt ]

  def self.create_with(new_delegate, user)
    if new_delegate.valid?
      input = Input.create!(inputable: new_delegate, user: user)
      OpenStruct.new(success: true, input_object: input.inputable)
    else
      OpenStruct.new(success: false, errors: new_delegate.errors)
    end
  end
end
