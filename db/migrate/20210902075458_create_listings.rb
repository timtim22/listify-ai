class CreateListings < ActiveRecord::Migration[6.1]
  def change
    create_table :listings, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.string :request_type
      t.string :property_type
      t.integer :sleeps
      t.string :location
      t.text :details

      t.timestamps
    end
  end
end
