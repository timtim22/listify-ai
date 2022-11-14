class SearchLocationsController < ApplicationController
  before_action :authenticate_user!

  def create
    search_text = search_location_params[:search_text].downcase
    @search_location = SearchLocation.find_or_create_with(search_text)
    record_search_by_user

    if @search_location.latitude.nil?
      render json: { no_results: ["Sorry, our search provider couldn't identify that place. You could try a different search term, e.g, 'Waterloo, London' instead of 'Waterloo'."] }, status: :unprocessable_entity
    else
      @attractions = AreaSearch::AttractionFinder.new(
        @search_location,
        search_location_params[:attraction_radius]
      ).find!

      respond_to do |format|
        if @search_location.save
          format.json { render :create, status: :created }
        else
          format.json { render json: @search_location.errors, status: :unprocessable_entity }
        end
      end
    end
  end

  private

  def search_location_params
    params.require(:search_location).permit(:search_text, :attraction_radius)
  end

  def record_search_by_user
    @search_location.recorded_searches.create!(
      user: current_user,
      attraction_radius: search_location_params[:attraction_radius]
    )
    recorded_search_volume = RecordedSearch.where('created_at > ?', Time.zone.today.beginning_of_day).count
    raise 'Unexpected search volume recorded!' if recorded_search_volume > 200

    return unless recorded_search_volume == 150

    AdminMailer.unexpected_search_volume.deliver_later
  end
end
