class ListingFragmentsController < ApplicationController
  before_action :authenticate_user!

  def create
    @runs_remaining = SpinCheck.runs_remaining(current_user)
    save = Input.create_with(object_for_fragment.new(listing_fragment_params), current_user)
    if save.success
      @listing_fragment = save.input_object
      @task_run = task_run_for_fragment
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

  def task_results
    @task_run = TaskRun.find(params[:task_run_id])
    @task_results = @task_run.task_results
  end

  private

  def object_for_fragment
    case listing_fragment_params[:request_type]
    when 'summary_fragment' then Inputs::SummaryFragment
    when 'bedroom_fragment' then Inputs::BedroomFragment
    when 'other_room_fragment' then Inputs::OtherRoomFragment
    end
  end

  def task_run_for_fragment
    if ['bedroom_fragment', 'other_room_fragment'].include? @listing_fragment.request_type
      TaskRunners::TwoStep.new.run_for!(
        @listing_fragment,
        current_user,
        "#{@listing_fragment.request_type}_step_2",
        nil
      )
    else
      TaskRunners::OneStep.new.run_for!(
        @listing_fragment,
        current_user,
        nil
      )
    end
  end

  def listing_fragment_params
    params.require(:listing_fragment).permit(:request_type, :input_text)
  end
end