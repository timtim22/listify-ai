RSpec.describe SpinCounter do

  describe 'spins_remaining' do

    context 'beta user' do
      it 'returns daily limit - spins today' do
        user = create(:user)
        allow(user).to receive(:on_private_beta?).and_return(:true)
        5.times { create(:task_run, :for_listing, user: user) }
        expected = SpinCounter::DAILY_BETA_SPINS - 5
        expect(SpinCounter.new(user).spins_remaining).to eq expected
      end
    end

    context 'beta user with custom limit' do
      it 'returns custom limit - spins today' do
        user = create(:user, custom_run_limit: 10)
        allow(user).to receive(:on_private_beta?).and_return(:true)
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
