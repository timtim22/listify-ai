class AreaDescriptionsController < ApplicationController
  before_action :authenticate_user!

  def create

    search_location = SearchLocation.find_or_create_by(
      search_text: area_description_params[:search_text]
    )
    if !search_location.latitude
      Geocoder.get_coordinates(search_location)
    end

    attractions = AttractionFinder.new(search_location).find!
    ##@area_description = AreaDescription.generate_from(attractions)


    save = OpenStruct.new

    respond_to do |format|
      if true
        format.json { render :create, status: :created }
      else
        format.json { render json: save.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def area_description_params
    params.require(:area_description).permit(:search_text)
  end
end


