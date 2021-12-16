FactoryBot.define do
  factory :subscription do
    user { nil }
    stripe_id { "MyString" }
    stripe_plan { "MyString" }
    status { "MyString" }
    trial_ends_at { "2021-12-10 19:53:28" }
    ends_at { "2021-12-10 19:53:28" }
  end
end
