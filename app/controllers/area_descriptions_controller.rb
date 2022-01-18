class AreaDescriptionsController < ApplicationController
  before_action :authenticate_user!

  def create
    if area_description_params[:selected_ids].length > 0
      description = AreaDescription.new_from(area_description_params)
      save = Input.create_with(description, current_user)
      if save.success
        @area_description = save.input_object
        @task_run = TaskRunner.new.run_for!(@area_description, current_user)
        @runs_remaining = current_user.runs_remaining_today
      end
    else
      save = OpenStruct.new(sucess: false, errors: { selected: ["Nothing was selected"] })
    end

    respond_to do |format|
      if save.success
        format.json { render :create, status: :created }
      else
        format.json { render json: save.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def area_description_params
    params.require(:area_description).permit(:search_location_id, :detail_text, selected_ids: [], search_results: {})
  end
end
