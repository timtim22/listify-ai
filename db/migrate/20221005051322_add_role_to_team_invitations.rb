class AddRoleToTeamInvitations < ActiveRecord::Migration[6.1]
  def change
    add_column :team_invitations, :role, :string
  end
end
