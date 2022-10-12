class AddInvitedByToTeamInvitations < ActiveRecord::Migration[6.1]
  def change
    add_column :team_invitations, :invited_by, :string
  end
end
