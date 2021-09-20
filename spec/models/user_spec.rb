RSpec.describe User, type: :model do
  describe 'runs_remaining_today' do
    context 'no runs' do
      it 'returns daily limit' do
        user = FactoryBot.build(:user)
        expect(user.runs_remaining_today).to eq User::DAILY_RUN_LIMIT
      end
    end
  end
end
