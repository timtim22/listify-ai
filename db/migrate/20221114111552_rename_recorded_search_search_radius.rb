class RenameRecordedSearchSearchRadius < ActiveRecord::Migration[6.1]
  def change
    rename_column :recorded_searches, :attraction_radius, :search_radius
  end
end
