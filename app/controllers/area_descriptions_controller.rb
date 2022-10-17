class AreaDescriptionsController < ApplicationController
  before_action :authenticate_user!

  def create
    @runs_remaining = SpinCheck.runs_remaining(current_user)
    description = AreaDescription.new_from(area_description_params)
    save = Input.create_with(description, current_user)
    if save.success
      @area_description = save.input_object
      @task_run = TaskRunners::OneStep.new.run_for!(@area_description, current_user)
      @runs_remaining -= 1
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
    params
      .require(:area_description)
      .permit(:search_location_id, :detail_text, :user_provided_area_name, selected_ids: [], search_results: {})
  end
end
