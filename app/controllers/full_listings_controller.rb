class FullListingsController < ApplicationController
  before_action :authenticate_user!

  def show
    @full_listing = FullListing.find(params[:id])
    @full_listing.check_complete
  end

  def create
    @runs_remaining = SpinCheck.runs_remaining(current_user)
    @full_listing = FullListing.from(full_listing_params, current_user)
    @runs_remaining -= 1

    respond_to do |format|
      if true
        format.json { render :create, status: :created }
      else
        format.json { render json: save.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def full_listing_params
    params.require(:full_listing).permit(:headline_text, :high_flair, :bedroom_count, :ideal_for, :key_features, rooms: [:id, :name, :description], bedrooms: [])
  end
end
