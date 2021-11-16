class Legacy::PromptsController < ApplicationController
  before_action :authenticate_admin

  def index
    @prompts = Legacy::Prompt.all
  end
end
