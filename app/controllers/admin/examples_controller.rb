class Admin::ExamplesController < ApplicationController
  before_action :authenticate_admin
  before_action :set_example, only: %i[ show edit update destroy ]

  def index
    @examples = Example.all

    @pagy, @examples = pagy(@examples)
  end

  def new
    @example = Example.new
  end

  def edit
  end

  def create
    @example = Example.new(example_params)

    respond_to do |format|
      if @example.save!
        format.html { redirect_to admin_examples_path, notice: 'Example created.' }
        format.json { redirect_to admin_examples_path, status: :created, notice: 'Example created.' }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @example.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    @example.assign_attributes(example_params)

    respond_to do |format|
      if @example.save
        format.html { redirect_to admin_examples_path, notice: 'Example updated.' }
        format.json { redirect_to admin_examples_path, status: :created, notice: 'Example updated.' }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @example.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @example.destroy

    respond_to do |format|
      format.html { redirect_to admin_examples_url, notice: 'Example was successfully destroyed.' }
    end
  end

  private

  def set_example
    @example = Example.find(params[:id])
  end

  def example_params
    params.require(:example).permit(:request_type, :completion, :input_structure, input_data: {})
  end
end
