RSpec.describe SpinCounter do

  describe 'spins_remaining' do

    context 'subscribed user' do
      it 'returns subscription spins - spins this month' do
        user = create(:user)
        plan = create(:plan, stripe_id: "StarterPlanId")
        subscription = create(:subscription, user: user, stripe_plan: "StarterPlanId")
        expected = 20
        expect(SpinCounter.new(user).spins_remaining).to eq 20
        5.times { create(:task_run, :for_listing, user: user) }
        create(:task_run, :for_listing, user: user, created_at: Date.today.beginning_of_month - 1.day)
        expect(SpinCounter.new(user).spins_remaining).to eq 15
      end
    end

    context 'trial user' do
      it 'returns trial spins - all spins by user' do
        user = create(:user)
        allow(user).to receive(:on_trial?).and_return(:true)
        trial_spins = SpinCounter::TRIAL_SPINS
        expect(SpinCounter.new(user).spins_remaining).to eq trial_spins
        5.times { create(:task_run, :for_listing, user: user) }
        expect(SpinCounter.new(user).spins_remaining).to eq trial_spins - 5
      end
    end

    context 'beta user' do
      it 'returns daily limit - spins today' do
        user = create(:user)
        allow(user).to receive(:on_private_beta?).and_return(:true)
        5.times { create(:task_run, :for_listing, user: user) }
        expected = SpinCounter::DAILY_BETA_SPINS - 5
        expect(SpinCounter.new(user).spins_remaining).to eq expected
      end
    end

    context 'user with custom limit' do
      it 'returns custom limit - spins today' do
        user = create(:user, custom_run_limit: 10)
        task_run = create(:task_run, :for_listing, user: user)
        expect(SpinCounter.new(user).spins_remaining).to eq 9
      end
    end

    context 'admin' do
      it 'returns daily limit' do
        user = create(:user, admin: true)
        task_run = create(:task_run, :for_listing, user: user)
        expected = SpinCounter::DAILY_BETA_SPINS
        expect(SpinCounter.new(user).spins_remaining).to eq expected
      end
    end
  end
end
