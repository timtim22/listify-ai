class RecordedSearchesController < ApplicationController
  before_action :authenticate_admin

  def index
    @q = RecordedSearch.ransack(params[:q])

    @recorded_searches = @q
      .result
      .includes(:user, :search_location)
      .order(created_at: :desc)

    @pagy, @recorded_searches = pagy(@recorded_searches, items: 30)
    assign_statistics
  end

  private

  def assign_statistics
    @statistics = OpenStruct.new(
      last_1_day: RecordedSearch.since(24.hours.ago).count,
      last_7_days: RecordedSearch.since(7.days.ago).count
    )
  end
end
