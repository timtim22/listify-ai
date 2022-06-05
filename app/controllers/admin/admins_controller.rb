class Admin::AdminsController < ApplicationController
  def index
    @users = User.admin_or_listify_team
  end
end
