class Admin::ModulesController < ApplicationController
  before_action :authenticate_admin

  def index
    @q = User.with_enabled_modules.ransack(params[:q])

    @users =
      @q
      .result
      .includes(:enabled_modules)

    @pagy, @users = pagy(@users, items: 30)
  end
end
