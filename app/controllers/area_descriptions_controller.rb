class AreaDescriptionsController < ApplicationController
  before_action :authenticate_user!

  def create
    @area_description = AreaDescription.new(area_description_params).generate

    respond_to do |format|
      if @area_description
        format.json { render :create, status: :created }
      else
        format.json { render json: @area_description.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def area_description_params
    params.require(:area_description).permit(selected_ids: [], search_results: {})
  end
end
