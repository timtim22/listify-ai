class BrandDescriptionsController < ApplicationController
  before_action :authenticate_user!

  def create
    @runs_remaining = SpinCheck.runs_remaining(current_user)
    description = Inputs::BrandDescription.new(brand_description_params)
    save = Input.create_with(description, current_user)
    if save.success
      @brand_description = save.input_object
      @task_run = TaskRunners::OneStep.new.run_for!(@brand_description, current_user)
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

  def brand_description_params
    params.require(:brand_description).permit(
      :request_type, :brand_name, :brand_details, :property_details, :location, :location_details, attractions: []
    )
  end
end
