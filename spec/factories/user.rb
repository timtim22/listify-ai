# This will guess the User class
FactoryBot.define do
  factory :user do
    first_name { "John" }
    password { 'password' }
    password_confirmation { 'password' }
    admin { false }
  end
end
