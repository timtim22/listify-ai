class CreateSearchResultTable < ActiveRecord::Migration[6.1]
  def change
    create_table :search_results, id: :uuid do |t|
      t.references :search_location, null: false, foreign_key: true, type: :uuid
      t.jsonb :results

      t.timestamps
    end
  end
end
