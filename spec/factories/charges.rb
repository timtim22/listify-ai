FactoryBot.define do
  factory :charge do
    user { nil }
    stripe_id { "MyString" }
    amount { 1 }
    amount_refunded { 1 }
    card_brand { "MyString" }
    card_last4 { "MyString" }
    card_exp_month { "MyString" }
    card_exp_year { "MyString" }
  end
end
