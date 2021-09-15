class ListingsController < ApplicationController
  before_action :authenticate_user!

  def new
    @listing = new_listing
    @runs_remaining = TaskRun.runs_remaining_today(current_user)
  end

  def create
    save = Input.create_with(Listing.new(listing_params), current_user)
    if save.success
      @listing  = save.input_object
      @task_run = TaskRunner.run_for!(@listing, current_user)
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

  def new_listing
    if params[:show_example]
      Listing.new(input_text: listing_example_input, request_type: "listing_description")
    else
      Listing.new(input_text: "", request_type: "listing_description")
    end
  end

  def listing_example_input
    str = <<~HEREDOC
      - beach penthouse in Malaga
      - 12th floor apartment with sea views
      - 1 large bedroom with double bed
      - private terrace
      - large balcony
      - 5 minutes walk from city centre
    HEREDOC
  end
end

