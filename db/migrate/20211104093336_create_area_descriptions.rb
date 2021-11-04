class CreateAreaDescriptions < ActiveRecord::Migration[6.1]
  def change
    create_table :area_descriptions, id: :uuid do |t|
      t.string :request_type
      t.jsonb :input_data

      t.timestamps
    end
  end
end
