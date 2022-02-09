RSpec.describe UserAccountStatus do

  describe 'check' do
    it 'private_beta' do
      user = create(:user, created_at: Date.new(2022, 1, 1).end_of_day)
      expect(UserAccountStatus.new(user).check).to eq 'private_beta'
    end

    it 'active_subscription' do
      user = create(:user, created_at: Date.new(2022, 1, 1).end_of_day)
      create(:subscription, user: user)
      user2 = create(:user)
      create(:subscription, user: user2)
      expect(UserAccountStatus.new(user).check).to eq 'active_subscription'
      expect(UserAccountStatus.new(user2).check).to eq 'active_subscription'
    end

    it 'lapsed_subscription' do
      user = create(:user)
      create(:subscription, user: user, status: 'cancelled', ends_at: Time.zone.yesterday)
      expect(UserAccountStatus.new(user).check).to eq 'lapsed_subscription'
    end

    it 'active_trial' do
      user = create(:user)
      expect(UserAccountStatus.new(user).check).to eq 'active_trial'
    end

    it 'lapsed_trial' do
      user = create(:user, created_at: Time.zone.today - 15.days)
      expect(UserAccountStatus.new(user).check).to eq 'lapsed_trial'
    end
  end
end
