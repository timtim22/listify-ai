class AddAuthorizationScopesToUser < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :authorization_scopes, :string, default: [], array: true
  end
end
