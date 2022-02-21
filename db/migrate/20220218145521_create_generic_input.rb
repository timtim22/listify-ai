class CreateGenericInput < ActiveRecord::Migration[6.1]
  def change
    create_table :generic_inputs, id: :uuid do |t|
      t.string :request_type
      t.text :input_text
      t.timestamps
    end
  end
end
