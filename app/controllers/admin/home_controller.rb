class Admin::HomeController < ApplicationController
  before_action :authenticate_user!

  def index
    authorize :admin, :index?
  end
end
