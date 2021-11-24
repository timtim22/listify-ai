class AddUserToFullListings < ActiveRecord::Migration[6.1]
  def change
    add_reference :full_listings, :user, foreign_key: true, type: :uuid
  end
end
