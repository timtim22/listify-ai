class AddExpirationToTeamInvitations < ActiveRecord::Migration[6.1]
  def change
    add_column :team_invitations, :expired_at, :datetime
  end
end
