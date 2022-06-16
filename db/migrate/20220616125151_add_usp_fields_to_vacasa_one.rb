class AddUspFieldsToVacasaOne < ActiveRecord::Migration[6.1]
  def change
    add_column :custom_inputs_vacasa_ones, :property_type, :string
    add_column :custom_inputs_vacasa_ones, :property_name, :string
    add_column :custom_inputs_vacasa_ones, :location, :string
    add_column :custom_inputs_vacasa_ones, :target_user, :string
    add_column :custom_inputs_vacasa_ones, :usp_one, :string
    add_column :custom_inputs_vacasa_ones, :usp_two, :string
    add_column :custom_inputs_vacasa_ones, :usp_three, :string
    add_column :custom_inputs_vacasa_ones, :usp_four, :string
    add_column :custom_inputs_vacasa_ones, :usp_five, :string
  end
end
