class CreateFullListing < ActiveRecord::Migration[6.1]
  def change
    create_table :full_listings, id: :uuid do |t|
      t.boolean :requests_completed, default: false

      t.timestamps
    end
  end
end
