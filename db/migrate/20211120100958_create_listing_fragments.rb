class CreateListingFragments < ActiveRecord::Migration[6.1]
  def change
    create_table :listing_fragments, id: :uuid do |t|
      t.references :full_listing, null: false, foreign_key: true, type: :uuid
      t.text :input_text
      t.string :request_type
      t.timestamps
    end
  end
end
