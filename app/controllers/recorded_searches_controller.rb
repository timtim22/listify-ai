class RecordedSearchesController < ApplicationController
  before_action :authenticate_admin

  def index
    @recorded_searches = RecordedSearch
      .includes(:user, :search_location)
      .order(created_at: :desc)
  end
end
