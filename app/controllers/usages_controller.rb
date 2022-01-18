class UsagesController < ApplicationController
  before_action :authenticate_user!

  def show
    @usage = SpinCounter.new(current_user).spin_stats
  end
end
