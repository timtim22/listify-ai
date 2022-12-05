class AccountsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_user

  def edit
  end

  def update
    @user.assign_attributes(account_params)

    notice =
      if @user.email_changed?
        'A message with a confirmation link has been sent to your email address. ' \
          'Please follow the link to activate your account before you can use your updated email to login.'
      else
        'Account updated successfully.'
      end

    respond_to do |format|
      if @user.save
        format.html { redirect_to edit_account_path, notice: notice }
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

