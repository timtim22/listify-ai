class Users::CustomTrialEndDatesController < ApplicationController
  before_action :authenticate_admin
  before_action :set_user

  def edit
  end

  def update
    respond_to do |format|
      if @user.update!(custom_trial_end_date: custom_trial_end_date_params[:date].to_date)
        format.html { redirect_to admin_trials_path, notice: 'Successfully updated.' }
      else
        format.html { render :edit, status: :unprocessable_entity }
      end
    end
  end

  private

  def set_user
    @user = User.find(params[:user_id])
  end

  def custom_trial_end_date_params
    params.require(:custom_trial_end_date).permit(:date)
  end
end
