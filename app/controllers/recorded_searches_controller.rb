class RecordedSearchesController < ApplicationController
  before_action :authenticate_admin

  def index
    @q = RecordedSearch.ransack(params[:q])

    @recorded_searches = @q
      .result
      .includes(:user, :search_location)
      .order(created_at: :desc)

    @pagy, @recorded_searches = pagy(@recorded_searches, items: 30)
  end
end
