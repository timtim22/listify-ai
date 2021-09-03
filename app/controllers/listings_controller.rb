class ListingsController < ApplicationController
  before_action :authenticate_user!

  def new
    @listing = Listing.new
  end

  def show
    @listing = Listing.find(params[:id])
  end

  def create
    save = Input.create_with(Listing.new(listing_params), current_user)
    if save.success
      @listing  = save.input_object
      @task_run = TaskRunner.run_for!(@listing, current_user)
    end

    respond_to do |format|
      if save.success
        format.html { redirect_to listing_path(@listing), notice: "Listing was successfully created." }
        format.json { redirect_to listing_path(@listing), status: :created, location: listings_path }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: save.errors, status: :unprocessable_entity }
      end
    end
  end

  def listing_params
    params.require(:listing).permit(:request_type, :property_type, :sleeps, :location, :details)
  end
end

