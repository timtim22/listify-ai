RSpec.describe SpinCounter do

  describe 'spins_remaining' do
    it 'counts regular spins correctly' do
      user = create(:user)
      allow(user).to receive(:on_trial?).and_return(true)
      3.times { create(:task_run, :for_listing, user: user) }
      expected = SpinCounter::TRIAL_SPINS - 3
      expect(SpinCounter.new(user).spins_remaining).to eq expected
    end

    it 'counts builder listings correctly' do
      user = create(:user)
      allow(user).to receive(:on_trial?).and_return(true)
      3.times { create(:task_run, :for_summary_fragment, user: user) }
      expected = SpinCounter::TRIAL_SPINS - 1
      expect(SpinCounter.new(user).spins_remaining).to eq expected
      2.times { create(:task_run, :for_summary_fragment, user: user) }
      expected = SpinCounter::TRIAL_SPINS - 1
      expect(SpinCounter.new(user).spins_remaining).to eq expected
      create(:task_run, :for_summary_fragment, user: user)
      expected = SpinCounter::TRIAL_SPINS - 2
      expect(SpinCounter.new(user).spins_remaining).to eq expected
    end


    context 'team user' do
      it 'returns team spins remaining' do
      user = create(:user)
      user_two = create(:user)
      team = create(:team, custom_spin_count: 200)
      team.add_user(user.email)
      team.add_user(user_two.email)
      2.times { create(:task_run, :for_listing, user: user) }
      3.times { create(:task_run, :for_summary_fragment, user: user) }
      expected = team.custom_spin_count - 3
      expect(SpinCounter.new(user_two).spins_remaining).to eq expected
      end
    end

    context 'subscribed user' do
      it 'returns subscription spins - spins this month' do
        user = create(:user)
        create(:plan, stripe_id: 'StarterPlanId')
        create(:subscription, user: user, stripe_plan: 'StarterPlanId')
        expect(SpinCounter.new(user).spins_remaining).to eq 75
        5.times { create(:task_run, :for_listing, user: user) }
        create(:task_run, :for_listing, user: user, created_at: Time.zone.today.beginning_of_month - 1.day)
        expect(SpinCounter.new(user).spins_remaining).to eq 70
      end

      it 'ignores spins before subscription date' do
        user = create(:user)
        create(:task_run, :for_listing, user: user)
        create(:plan, stripe_id: 'StarterPlanId')
        create(:subscription, user: user, stripe_plan: 'StarterPlanId')
        expect(SpinCounter.new(user).spins_remaining).to eq 75
        5.times { create(:task_run, :for_listing, user: user) }
        create(:task_run, :for_listing, user: user, created_at: Time.zone.today.beginning_of_month - 1.day)
        expect(SpinCounter.new(user).spins_remaining).to eq 70
      end
    end

    context 'trial user' do
      it 'returns trial spins - all spins by user' do
        user = create(:user)
        allow(user).to receive(:on_trial?).and_return(true)
        trial_spins = SpinCounter::TRIAL_SPINS
        expect(SpinCounter.new(user).spins_remaining).to eq trial_spins
        5.times { create(:task_run, :for_listing, user: user) }
        expect(SpinCounter.new(user).spins_remaining).to eq trial_spins - 5
      end
    end

    context 'expired trial user' do
      it 'returns 0' do
        user = create(:user)
        allow(user).to receive(:on_trial?).and_return(false)
        expect(SpinCounter.new(user).spins_remaining).to eq 0
      end
    end

    context 'beta user' do
      it 'returns daily limit - spins this month' do
        user = create(:user)
        allow(user).to receive(:private_beta_account?).and_return(true)
        5.times { create(:task_run, :for_listing, user: user) }
        expected = SpinCounter::TRIAL_SPINS - 5
        expect(SpinCounter.new(user).spins_remaining).to eq expected
      end
    end

    context 'user with custom limit' do
      it 'returns custom limit - spins this month' do
        user = create(:user, custom_run_limit: 10)
        create(:task_run, :for_listing, user: user)
        expect(SpinCounter.new(user).spins_remaining).to eq 9
      end
    end

    context 'admin' do
      it 'returns trial limit' do
        user = create(:user, admin: true)
        create(:task_run, :for_listing, user: user)
        expected = SpinCounter::TRIAL_SPINS
        expect(SpinCounter.new(user).spins_remaining).to eq expected
      end
    end
  end
end
