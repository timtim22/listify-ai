class FeedbacksController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create]

  def create
    check_token
    @feedback = Feedback.new(feedback_params)
    respond_to do |format|
      if @feedback.save!
        format.json { render status: :ok }
      else
        format.json { render json: @feedback.errors, status: :unprocessable_entity }
      end
    end
  end

  def feedback_params
    params.require(:feedback).permit(:task_run_id, :sentiment)
  end
end
