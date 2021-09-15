class HomeController < ApplicationController
  before_action :authenticate_user!, except: [:terms, :privacy]

  def index
  end

  def terms
  end

  def privacy
  end
end
