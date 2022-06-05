class Admin::AdminsController < ApplicationController
  before_action :authenticate_admin

  def index
    @users = User.admin_or_listify_team
  end
end
