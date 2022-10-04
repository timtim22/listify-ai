class TeamRolePolicy < ApplicationPolicy
  attr_reader :user

  def initialize(user, _record)
    @user = user
  end

  def destroy?
    user.team_admin? || admin? || user.on_listify_team?
  end
end
