class HomeController < ApplicationController
  before_action :authenticate_user!

  def index
    if !current_user.admin?
      redirect_to new_listing_path
    end
  end

  def listings
  end
end
