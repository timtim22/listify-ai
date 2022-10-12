class TeamInvitation < ApplicationRecord
  belongs_to :team

  enum status: {
    pending: 0,
    accepted: 1
  }

  validates :email, uniqueness: { scope: :team, message: 'already invited.' }
  validates :role, inclusion: { in: TeamRole::VALID_ROLES, message: "%{value} is not a valid role" }

  validate :email_already_in_team, on: :create
  validate :seat_available, on: :create

  def email_already_in_team
    users = User.joins(:team_role).where(email: email, team_role: { team_id: team_id })
    errors.add(:email, "can't invite existing email in the team") if users.present?
  end

  def seat_available
    return true if team.invitation_seat_available?

    errors.add(:email, 'no available seat count')
  end

  def expired?
    expired_at < Time.zone.now
  end
end
