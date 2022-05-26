class ExamplePolicy < ApplicationPolicy
  attr_reader :user, :example

  def initialize(user, example)
    @user = user
    @example = example
  end

  def index?
    user.admin? || user.on_listify_team?
  end

  def create?
    index?
  end

  def new?
    index?
  end

  def update?
    index?
  end

  def edit?
    index?
  end

  def destroy?
    index?
  end
end
