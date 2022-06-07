class CreateCustomInputsSykesMiddle < ActiveRecord::Migration[6.1]
  def change
    create_table :custom_inputs_sykes_middles, id: :uuid do |t|
      t.string :request_type
      t.text :input_text
      t.text :key_features
      t.string :tags, array: true, default: []
      t.timestamps
    end
  end
end
