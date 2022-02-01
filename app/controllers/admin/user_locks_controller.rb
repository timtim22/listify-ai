class Admin::UserLocksController < ApplicationController
  before_action :authenticate_admin
  before_action :set_user

  def create
    @user.lock_account!
    redirect_back(fallback_location: root_path, notice: 'Account was soft-locked' )

  end

  def destroy
    @user.update(account_locked: false)
    redirect_back(fallback_location: root_path, notice: 'Account was unlocked' )
  end

  private

  def set_user
    @user = User.find(params[:id])
  end
end
