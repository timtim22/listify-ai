FactoryBot.define do
  factory :team_invitation do
    email { 'test@email.com' }
    association :team
    invited_by { 'test1@email.com' }
    expired_at { Time.zone.now + 7.days }
    role { 'user' }
  end
end
