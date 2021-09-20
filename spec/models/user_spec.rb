RSpec.describe User, type: :model do
  describe 'runs_remaining_today' do
    context 'no runs' do
      it 'returns daily limit' do
        user = User.new(email: 'test@example.com', password: 'password', password_confirmation: 'password')
        expect(user.runs_remaining_today).to eq User::DAILY_RUN_LIMIT
      end
    end
  end
end
