FactoryBot.define do
  factory :plan do
    name { "starter" }
    amount { 3900 }
    interval { "month" }
    stripe_id { "StarterPlanId" }
  end
end
