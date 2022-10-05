class TeamInvitationPolicy < ApplicationPolicy
  attr_reader :user

  def initialize(user, _record)
    @user = user
  end

  def destroy?
    admin?
  end

  def create?
    admin?
  end

  def new?
    admin?
  end

  def resend?
    admin?
  end

  private

  def admin?
    user.team_admin? || admin? || user.on_listify_team?
  end
end
