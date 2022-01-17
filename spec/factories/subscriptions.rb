FactoryBot.define do
  factory :subscription do
    user { nil }
    stripe_id { "MyString" }
    stripe_plan { "StarterPlanId" }
    status { "active" }
  end
end
