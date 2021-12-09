class SearchLocationsController < ApplicationController
  before_action :authenticate_user!

  def create
    search_text = search_location_params[:search_text].downcase
    @search_location = SearchLocation.find_or_create_with(search_text)
    record_search_by_user

    if @search_location.latitude.nil?
      render json: { no_results: ["Sorry, we didn't find any results. Please try another search."] }, status: :unprocessable_entity
    else
      @attractions = AttractionFinder.new(@search_location).find!

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
    params.require(:search_location).permit(:search_text)
  end

  def record_search_by_user
    @search_location.recorded_searches.create!(user: current_user)
  end
end
