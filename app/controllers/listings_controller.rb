class ListingsController < ApplicationController
  before_action :authenticate_user!

  def new
    @listing = Listing.new
  end

  def show
    @listing = Listing.find(params[:id])
  end

  def create
    @listing = Listing.new(listing_params.merge({ user_id: current_user.id }))

    respond_to do |format|
      if @listing.save
        format.html { redirect_to listings_path(@listing), notice: "Listing was successfully created." }
        format.json { redirect_to listings_path(@listing), status: :created, location: listings_path }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @listing.errors, status: :unprocessable_entity }
      end
    end
  end

  def listing_params
    params.require(:listing).permit(:request_type, :property_type, :sleeps, :location, :details)
  end
end

