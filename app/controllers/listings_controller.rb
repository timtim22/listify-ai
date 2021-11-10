class ListingsController < ApplicationController
  before_action :authenticate_user!

  def new
    @show_example = params[:show_example]
    @runs_remaining = TaskRun.runs_remaining_today(current_user)
  end

  def create
    save = Input.create_with(Listing.new(listing_params), current_user)
    if save.success
      @listing  = save.input_object
      @task_run = TaskRunner.new.run_for!(@listing, current_user, params[:output_language])
      @runs_remaining = TaskRun.runs_remaining_today(current_user)
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

  def listing_params
    params.require(:listing).permit(:request_type, :property_type, :sleeps, :location, :input_text)
  end
end

