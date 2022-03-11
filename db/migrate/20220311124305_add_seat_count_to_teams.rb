class AddSeatCountToTeams < ActiveRecord::Migration[6.1]
  def change
    add_column :teams, :seat_count, :integer
  end
end
