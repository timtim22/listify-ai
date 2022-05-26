class RecordedCompletionPolicy < ApplicationPolicy
  attr_reader :user, :record

  def initialize(user, record)
    @user = user
    @record = record
  end

  def index?
    user.admin? || user.on_listify_team?
  end

  def show?
    index?
  end
end
