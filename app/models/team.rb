class Team < ApplicationRecord
  has_many :team_roles, dependent: :destroy
  has_many :users, through: :team_roles
  has_many :team_invitations, dependent: :destroy

  def add_user(email)
    user = User.find_by(email: email)
    return team_roles.create_user_role(self, user) if user

    false
  end

  def add_admin(email)
    user = User.find_by(email: email)
    return team_roles.create_admin_role(self, user) if user

    false
  end

  def add_purchaser(email)
    user = User.find_by(email: email)
    return team_roles.create_purchaser_role(self, user) if user

    false
  end

  def monthly_spins
    custom_spin_count
  end

  def seat_available?
    seat_count > users.count
  end

  def invitation_seat_available?
    seat_count > (users.count + team_invitations.where(status: 'pending').count)
  end
end
