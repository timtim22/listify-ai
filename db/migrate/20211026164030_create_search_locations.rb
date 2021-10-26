class CreateSearchLocations < ActiveRecord::Migration[6.1]
  def change
    create_table :search_locations, id: :uuid do |t|
      t.string :search_text
      t.float :latitude
      t.float :longitude

      t.timestamps
    end
  end
end
