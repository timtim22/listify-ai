class Admin::StatisticsController < ApplicationController
  before_action :authenticate_admin

  def index
    @account_status_counts = UserAccountStatus.tally_all
    all_users = User.includes(:team, :team_role, :subscriptions).order(created_at: :desc)

    @users =
      if params[:account_status] == 'trial'
        all_users.select { |s| UserAccountStatus::TRIAL_STATES.include?(s.account_status) }
      else
        all_users.reject { |s| UserAccountStatus::TRIAL_STATES.include?(s.account_status) }
      end
  end
end
