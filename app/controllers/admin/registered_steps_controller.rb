class Admin::RegisteredStepsController < ApplicationController
  before_action :set_service_options, only: %i[new edit]
  before_action :set_step, only: %i[show edit]
  before_action :set_procedure

  def new
    @step = Step::Prompt.new_from_defaults
  end

  def edit; end

  def show; end

  private

  def set_step
    @step = Step::Prompt.find(params[:id])
  end

  def set_service_options
    @service_options = Rails.env.production? ? Completion::Services::PRODUCTION : Completion::Services::ALL
  end

  def set_procedure
    @procedure = if %w[edit show].include? params['action']
                   RegisteredStep.find(params[:procedure_id]).procedure
                 else
                   Procedure.find(params[:procedure_id])
                 end
  end
end
