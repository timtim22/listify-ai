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
      it 'returns 5' do
        user = create(:user)
        allow(user).to receive(:on_trial?).and_return(false)
        expect(SpinCounter.new(user).spins_remaining).to eq 5
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

  describe 'team_spin_stas' do
    let(:team) { create(:team) }
    let(:users) do
      2.times.map do
        user = create(:user)
        team.add_user(user.email)
        user
      end
    end

    it 'returns team spin stats correctly' do
      start_of_month = Time.zone.today.beginning_of_month.beginning_of_day
      user_one, user_two = users
      8.times { create(:task_run, :for_listing, user: user_one, created_at: Time.zone.now) }
      13.times { create(:task_run, :for_listing, user: user_two, created_at: Time.zone.now) }
      10.times { create(:task_run, :for_listing, user: user_one, created_at: start_of_month - 10.days) }

      team_spin_stats = SpinCounter.new.team_spin_stats(team)
      expect(team_spin_stats[:name]).to eql(team.name)
      expect(team_spin_stats[:spin_usage_7_days]).to eql(21)
      expect(team_spin_stats[:spin_usage_this_month]).to eql(21)
      expect(team_spin_stats[:spin_usage_previous_month]).to eql(10)
      expect(team_spin_stats[:spin_usage_increase]).to eql(21 / 10.to_f * 100)
    end
  end
end
