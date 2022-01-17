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

    it 'false if expired' do
      user = create(:user, created_at: Date.today - 15.days)
      expect(user.on_trial?).to eq false
    end
  end

  describe 'on_private_beta?' do
    it 'true before date' do
      @user.update(created_at: Date.new(2022, 01, 05).beginning_of_day)
      expect(@user.on_private_beta?).to eq true
    end

    it 'true if subscription failed' do @user.update(created_at: Date.new(2022, 01, 05).beginning_of_day)
      subscription = create(:subscription, user: @user, status: "incomplete")
      @user.save
      expect(@user.on_private_beta?).to eq true
    end

    it 'false after date' do
      expect(@user.on_private_beta?).to eq false
    end

    it 'false with subscription' do
      @user.update(created_at: Date.new(2022, 01, 05).beginning_of_day)
      subscription = create(:subscription, user: @user)
      @user.save
      expect(@user.on_private_beta?).to eq false
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
