class CopyEventsController < ApplicationController
  before_action :authenticate_user!

  def create
    @result = TaskResult.find_by(id: params[:result_id]) || TextResult.find(params[:result_id])

    respond_to do |format|
      if @result.record_copy_event!
        format.json { render status: :ok }
      else
        format.json { render json: @result.errors, status: :unprocessable_entity }
      end
    end
  end
end
