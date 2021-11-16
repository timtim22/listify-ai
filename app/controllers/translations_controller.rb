class TranslationsController < ApplicationController
  before_action :authenticate_user!

  def create
    @task_result = TaskResult.find(translation_params[:task_result_id])
    @translation = Translation.fetch_new!(
      translation_params[:language],
      @task_result
    )

    respond_to do |format|
      if @translation.save
        format.json { render :create, status: :created }
      else
        format.json { render json: @translation.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def translation_params
    params.require(:translation).permit(:language, :task_result_id)
  end
end
