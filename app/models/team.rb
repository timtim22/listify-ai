class Team < ApplicationRecord
  has_many :team_roles, dependent: :destroy
  has_many :users, through: :team_roles
  has_many :team_invitations, dependent: :destroy

  def self.create_with_plan!(company_name, plan)
    create!(
      name: company_name,
      seat_count: plan.default_seat_count,
      custom_spin_count: plan.default_spin_cap
    )
  end

  def add_user(user_or_email)
    user = find_user(user_or_email)
    return team_roles.create_user_role(self, user) if user

    false
  end

  def add_admin(user_or_email)
    user = find_user(user_or_email)
    return team_roles.create_admin_role(self, user) if user

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

  def find_user(user_or_email)
    if user_or_email.is_a?(User)
      user_or_email
    else
      User.find_by(email: user_or_email)
    end
  end
end
