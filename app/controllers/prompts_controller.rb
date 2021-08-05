class PromptsController < ApplicationController
  before_action :authenticate_admin

  def index
    @prompts = Prompt.all
  end
end
