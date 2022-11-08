RSpec.describe Subscriptions::TeamSetup do
  let(:subject) { Subscriptions::TeamSetup }
  let(:user) { create(:user) }
  let(:subscription) { create(:subscription, user: user) }

  before(:each) do
    allow(Team).to receive(:create_with_plan!) { Team.create(name: 'Test Company') }
  end

  describe 'call' do
    it 'returns if user has team' do
      team = create(:team, name: 'Test Company')
      team.add_user(user)
      subject.call(subscription, user)
      expect(Team).not_to have_received(:create_with_plan!)
    end

    it 'returns if team exists' do
      allow(user).to receive_message_chain(:stripe_customer, :name) { 'Test Company' }
      create(:team, name: 'Test Company')
      subject.call(subscription, user)
      expect(Team).not_to have_received(:create_with_plan!)
    end

    it 'creates team' do
      allow(user).to receive_message_chain(:stripe_customer, :name) { 'Test Company' }
      plan = create(:plan)
      allow(subscription).to receive(:plan) { plan }
      subject.call(subscription, user)
      team = Team.find_by(name: 'Test Company')
      expect(team).to be_present
      expect(team.users.count).to eq 1
      expect(team.users).to eq [user]
    end
  end
end
