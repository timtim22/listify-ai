FactoryBot.define do
  factory :prompt_set do
    sequence(:request_type) {|n| "request_type_#{n}"}
  end
end
