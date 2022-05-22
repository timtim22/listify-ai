class CreateCustomInputsOyoOnes < ActiveRecord::Migration[6.1]
  def change
    create_table :custom_inputs_oyo_ones, id: :uuid do |t|
      t.string :request_type
      t.string :input_text
      t.string :property_type
      t.string :target_user
      t.string :location
      t.string :location_detail
      t.string :usp_one
      t.string :usp_two
      t.string :usp_three
      t.string :tags, array: true, default: []
      t.timestamps
    end
  end
end
