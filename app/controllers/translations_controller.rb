class TranslationsController < ApplicationController
  before_action :authenticate_user!

  def create
    translatable_class  = class_for(translation_params[:object_type])
    translatable_object = translatable_class.find(translation_params[:object_id])

    @translation = Translation.fetch_new!(
      translation_params[:language],
      translatable_object
    )

    respond_to do |format|
      if @translation.save
        format.json { render :create, status: :created }
      else
        format.json { render json: @translation.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def class_for(object_name)
    translatable_classes = [TaskResult, FullListing]
    translatable_classes.find { |c| c == object_name.constantize }
  end

  def translation_params
    params.require(:translation).permit(:language, :object_id, :object_type)
  end
end
