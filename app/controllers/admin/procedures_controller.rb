class Admin::ProceduresController < ApplicationController
  before_action :authenticate_admin
  before_action :set_procedure, only: %i[show edit update destroy]

  def index
    @procedures = Procedure.all

    @pagy, @procedures = pagy(@procedures, items: 10)
  end

  def new
    @procedure = Procedure.new
  end

  def show
    @procedure_steps = @procedure.registered_steps

    @pagy, @procedure_steps = pagy(@procedure_steps, items: 10)
    @procedure = Procedure.find(params[:id])
  end

  def edit; end

  def create
    @procedure = Procedure.new(procedure_params)

    respond_to do |format|
      if @procedure.save
        format.html { redirect_to admin_procedures_path, notice: 'Procedure created.' }
        format.json { redirect_to admin_procedures_path, status: :created, notice: 'Procedure created.' }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @procedure.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    @procedure.update(procedure_params)

    respond_to do |format|
      if @procedure.save
        format.html { redirect_to admin_procedures_path, notice: 'Procedure updated.' }
        format.json { redirect_to admin_procedures_path, status: :created, notice: 'Procedure updated.' }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @procedure.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @procedure.destroy

    respond_to do |format|
      format.html { redirect_to admin_procedures_path, notice: 'Procedure was successfully destroyed.' }
    end
  end

  private

  def set_procedure
    @procedure = Procedure.find(params[:id])
  end

  def procedure_params
    params.require(:procedure).permit(:title, :tag)
  end
end
