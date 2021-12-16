RSpec.describe User, type: :model do
  before(:each) do
    @user = create(:user)
  end

  describe 'runs_remaining_today' do
    context 'daily limit' do
      it 'returns daily limit - runs today' do
        expect(@user.runs_remaining_today).to eq User::DAILY_RUN_LIMIT
        5.times { create(:task_run, :for_listing, user: @user) }
        expect(@user.runs_remaining_today).to eq User::DAILY_RUN_LIMIT - 5
      end
    end

    context 'custom limit' do
      it 'returns custom limit - runs today' do
        @user.update(custom_run_limit: 10)
        task_run = create(:task_run, :for_listing, user: @user)
        expect(@user.runs_remaining_today).to eq 9
      end
    end

    context 'admin' do
      it 'returns daily limit' do
        @user.update(admin: true)
        task_run = create(:task_run, :for_listing, user: @user)
        expect(@user.runs_remaining_today).to eq User::DAILY_RUN_LIMIT
      end
    end
  end

  describe 'update_card' do
    it 'updates card', :vcr do
      @user.update_card("pm_card_visa")
      expect(@user.card_brand).to eq "Visa"
      expect(@user.card_last4).to eq "4242"
    end
  end

  describe 'subscribe' do
    it 'subscribes if no authentication needed', :vcr do
      @user.update_card("pm_card_visa")
      @user.subscribe(STARTER_PLAN)
      expect(@user.subscription).not_to be_nil
      expect(@user.subscribed?).to be true
    end

    it 'does not subscribe if authentication needed', :vcr do
      @user.update_card("pm_card_authenticationRequired")
      expect { @user.subscribe(STARTER_PLAN) }.to raise_error PaymentIncomplete
      expect(Subscription.order(:created_at).last.status).to eq "incomplete"
    end

    it 'subscribes with trial', :vcr do
      travel_to(VCR.current_cassette.originally_recorded_at || Time.current) do
        @user.update_card("pm_card_visa")
        @user.subscribe(STARTER_PLAN, trial_period_days: 5)
        expect(@user.subscribed?).to be true
        expect(@user.subscription.on_trial?).to be true
      end
    end
  end
end
