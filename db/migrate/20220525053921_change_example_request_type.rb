class ChangeExampleRequestType < ActiveRecord::Migration[6.1]
  def change
    remove_column :examples, :request_types
    add_column :examples, :request_type, :string
  end
end
