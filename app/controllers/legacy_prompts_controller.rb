class LegacyPromptsController < ApplicationController
  before_action :authenticate_admin

  def index
    @prompts = LegacyPrompt.all
  end
end
