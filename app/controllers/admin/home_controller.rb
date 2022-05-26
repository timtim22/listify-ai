class Admin::HomeController < ApplicationController

  def index
    authorize :admin, :index?
  end
end
