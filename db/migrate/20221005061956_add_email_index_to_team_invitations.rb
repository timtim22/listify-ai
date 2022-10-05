class AddEmailIndexToTeamInvitations < ActiveRecord::Migration[6.1]
  def change
    add_index :team_invitations, %i[email team_id], unique: true
  end
end
