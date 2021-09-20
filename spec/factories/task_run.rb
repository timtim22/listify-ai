FactoryBot.define do
  factory :task_run do
    association :user
    association :prompt_set
    trait :for_listing do
      association :input_object, factory: :listing
    end
  end
end

