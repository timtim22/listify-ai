RSpec.describe User, type: :model do
  describe 'runs_remaining_today' do
    context 'daily limit' do
      it 'returns daily limit - runs today' do
        user  = create(:user)
        user2 = create(:user)
        task_run = create(:task_run, :for_listing, user: user2)
        expect(user.runs_remaining_today).to eq User::DAILY_RUN_LIMIT
        expect(user2.runs_remaining_today).to eq User::DAILY_RUN_LIMIT - 1
      end
    end
    context 'custom limit' do
      it 'returns custom limit - runs today' do
        user = create(:user, custom_run_limit: 10)
        task_run = create(:task_run, :for_listing, user: user)
        expect(user.runs_remaining_today).to eq 9
      end
    end
    context 'admin' do
      it 'returns daily limit' do
        user  = create(:user, admin: true)
        task_run = create(:task_run, :for_listing, user: user)
        expect(user.runs_remaining_today).to eq User::DAILY_RUN_LIMIT
      end
    end
  end
end
