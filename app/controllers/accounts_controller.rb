class AccountsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_user

  def edit
  end

  def update
    @user.assign_attributes(account_params)

    respond_to do |format|
      if @user.save
        format.html { redirect_to edit_account_path, notice: 'Account updated successfully' }
        format.json { render :edit, status: :updated, location: edit_account_path }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def set_user
    @user = current_user
  end

  def account_params
    params.require(:user).permit(:first_name, :last_name, :email)
  end
end

