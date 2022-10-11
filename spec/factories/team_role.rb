FactoryBot.define do
  factory :team_role do
    association :user
    association :team
    name { 'user' }
  end
end
