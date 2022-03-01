class CreateBrandDescriptions < ActiveRecord::Migration[6.1]
  def change
    create_table :brand_descriptions, id: :uuid do |t|
      t.string :request_type
      t.string :brand_name
      t.text :brand_details
      t.text :property_details
      t.string :location
      t.text :location_details
      t.string :attractions, array: true, default: []
      t.timestamps
    end
  end
end
