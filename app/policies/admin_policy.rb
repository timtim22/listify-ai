class AdminPolicy < ApplicationPolicy
  attr_reader :user

  def initialize(user, _record)
    @user = user
  end

  def index?
    user.admin? || user.on_listify_team?
  end
end
