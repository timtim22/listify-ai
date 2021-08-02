class InputsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    text = params[:text] || TextFromSpeech.new.from(params[:blob])
    prompt = Prompt.correct_grammar(text)
    #@response = GptClient.new(prompt).generate_request
    @response = { success: true, response_text: text }
    respond_to do |format|
      if true
        format.json { render status: :ok }
      end
    end

  end
end
