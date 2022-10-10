class AreaDescriptionsController < ApplicationController
  before_action :authenticate_user!

  def create
    @runs_remaining = SpinCheck.runs_remaining(current_user)
    search_location = SearchLocation.find_by(id: params[:area_description][:search_location_id])
    description = search_location.area_descriptions.order(:created_at).last
    description.update_form(
      params[:area_description][:selected_ids],
      params[:area_description][:detail_text],
      params[:area_description][:user_provided_area_name]
    )

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
end
