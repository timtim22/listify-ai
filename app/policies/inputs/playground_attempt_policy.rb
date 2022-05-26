class Inputs::PlaygroundAttemptPolicy < ApplicationPolicy
  attr_reader :user, :record

  def initialize(user, record)
    @user = user
    @record = record
  end

  def create?
    user.admin? || user.on_listify_team?
  end
end
