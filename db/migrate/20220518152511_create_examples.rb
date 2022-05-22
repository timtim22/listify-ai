class CreateExamples < ActiveRecord::Migration[6.1]
  def change
    create_table :examples, id: :uuid do |t|
      t.string :input_structure
      t.jsonb :input_data
      t.text :prompt
      t.text :completion, null: false
      t.string :request_types, array: true, default: []
      t.string :tags, array: true, default: []
      t.timestamps
    end
  end
end
