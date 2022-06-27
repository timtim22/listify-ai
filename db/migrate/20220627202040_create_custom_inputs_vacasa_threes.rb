class CreateCustomInputsVacasaThrees < ActiveRecord::Migration[6.1]
  def change
    create_table :custom_inputs_vacasa_threes, id: :uuid do |t|
      t.string :request_type
      t.text :input_text
      t.text :things_to_know
      t.string :tags, array: true, default: []
      t.timestamps
    end
  end
end
