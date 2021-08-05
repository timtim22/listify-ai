class TasksController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    #text = params[:text] || TextFromSpeech.new.from(params[:blob])
    #prompt = Prompt.for(params[:task_type], text)

    if true #testing without gpt calls
      input_text = params[:text] || TextFromSpeech.new.from(params[:blob])
      @task = Task.new(input_text: input_text, result_text: input_text)
    else
      @task = TaskRunner.run_for!(
        params[:text],
        params[:blob],
        params[:task_type]
      )
    end

    respond_to do |format|
      if true
        format.json { render status: :ok }
      end
    end

  end
end
