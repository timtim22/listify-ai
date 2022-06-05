RSpec.describe User, type: :model do
  before(:each) do
    @user = create(:user)
  end

  describe 'on_trial?' do
    it 'true' do
      user = create(:user)
      expect(user.on_trial?).to eq true
    end

    it 'false with valid subscription' do
      user = create(:user)
      subscription = create(:subscription, user: user)
      expect(user.on_trial?).to eq false
    end

    it 'false if trial expired' do
      user = create(:user, created_at: Date.today - 15.days)
      expect(user.on_trial?).to eq false
    end
  end

  describe 'trial_end_date' do
    it 'custom trial end date' do
      end_date = Time.zone.today + 4.days
      user = create(:user, custom_trial_end_date: end_date)
      expect(user.trial_end_date).to eq end_date
    end

    it '14 days by default' do
      user = create(:user)
      expect(user.trial_end_date).to eq Time.zone.today + 14.days
    end

    it '44 days with promotion code' do
      user = create(:user, promotion_code: 'friendoflistify')
      expect(user.trial_end_date).to eq Time.zone.today + 44.days
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
