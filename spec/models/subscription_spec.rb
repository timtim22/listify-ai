RSpec.describe Subscription, type: :model do
  before(:each) do
    @user = create(:user)
    @user.update_card("pm_card_visa")
    create(:plan, stripe_id: STARTER_PLAN)
    @subscription = @user.subscribe(STARTER_PLAN)
  end

  describe "subscription changes" do
    it "swaps plans", :vcr do
      @subscription.swap(STANDARD_PLAN)
      expect(STANDARD_PLAN).to eq @subscription.stripe_plan
    end

    it "cancel subscription", :vcr do
      travel_to(VCR.current_cassette.originally_recorded_at || Time.current) do
        @subscription.cancel
        expect(@subscription.cancelled?).to be true
        expect(@subscription.on_grace_period?).to be true
      end
    end

    it "cancel subscription immediately", :vcr do
      @subscription.cancel_now!
      expect(@subscription.cancelled?).to be true
      expect(@subscription.on_grace_period?).to be false
    end

    it "resume subscription", :vcr do
      travel_to(VCR.current_cassette.originally_recorded_at || Time.current) do
        @subscription.cancel
        @subscription.resume
        expect(@subscription.cancelled?).to be false
        expect(@subscription.active?).to be true
      end
    end

    it "does not resume outside the grace period", :vcr do
      @subscription.cancel_now!
      expect { @subscription.resume }.to raise_error StandardError
    end
  end
end
