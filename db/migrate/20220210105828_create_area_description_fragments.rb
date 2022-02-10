class CreateAreaDescriptionFragments < ActiveRecord::Migration[6.1]
  def change
    create_table :area_description_fragments, id: :uuid do |t|
      t.references :search_location, null: false, foreign_key: true, type: :uuid
      t.string :request_type
      t.text :detail_text
      t.jsonb :input_data
      t.timestamps
    end
  end
end
