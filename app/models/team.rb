class Team < ApplicationRecord
  has_many :team_roles, dependent: :destroy
  has_many :users, through: :team_roles

  def add_user(email)
    user = User.find_by(email: email)
    team_roles.create_user_role(self, user) if user
  end

  def add_admin(email)
    user = User.find_by(email: email)
    team_roles.create_admin_role(self, user) if user
  end

  def monthly_spins
    custom_spin_count
  end
end
