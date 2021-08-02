class InputsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    text = TextFromSpeech.new.run_for(params[:blob])
    binding.pry
    text
  end
end
