class CreateCustomInputsOyoTwo < ActiveRecord::Migration[6.1]
  def change
    create_table :custom_inputs_oyo_twos, id: :uuid do |t|
      t.string :request_type
      t.text :input_text
      t.string :usp_one
      t.string :usp_two
      t.string :usp_three
      t.string :usp_four
      t.string :usp_five
      t.string :tags, array: true, default: []
      t.timestamps
    end
  end
end
