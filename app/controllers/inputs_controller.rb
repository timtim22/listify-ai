class InputsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    text = params[:text] || TextFromSpeech.new.from(params[:blob])
    prompt = Prompt.for(params[:task_type], text)

    puts "PROMPT"
    puts prompt
    puts "-----"

    if false #testing without gpt calls
      @response = { success: true, original_text: text, response_text: text }
    else
      @response = GptClient.new(prompt, text).generate_request
    end

    respond_to do |format|
      if true
        format.json { render status: :ok }
      end
    end

  end
end
