class AddAttractionRadiusToRecordedSearch < ActiveRecord::Migration[6.1]
  def change
    add_column :recorded_searches, :attraction_radius, :integer
  end
end
