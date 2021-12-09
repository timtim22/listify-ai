class CreateRecordedSearches < ActiveRecord::Migration[6.1]
  def change
    create_table :recorded_searches, id: :uuid do |t|
      t.references :search_location, null: false, foreign_key: true, type: :uuid
      t.references :user, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
