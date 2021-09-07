class CreateWritings < ActiveRecord::Migration[6.1]
  def change
    create_table :writings, id: :uuid do |t|
      t.string :request_type
      t.text :input_text

      t.timestamps
    end
  end
end
