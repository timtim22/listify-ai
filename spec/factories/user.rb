FactoryBot.define do
  sequence :email do |n|
    "test_suite_user#{n}@example.com"
  end
end

FactoryBot.define do
  factory :user do
    first_name { "John" }
    last_name { "TestSuiteUser" }
    email
    password { "password" }
    password_confirmation { "password" }
    admin { false }
  end
end
