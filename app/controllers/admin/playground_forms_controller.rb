class Admin::PlaygroundFormsController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_playground_attempt

  def new
  end

  private

  def authorize_playground_attempt
    authorize Inputs::PlaygroundAttempt
  end
end

