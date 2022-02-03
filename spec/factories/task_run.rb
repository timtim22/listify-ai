FactoryBot.define do
  factory :task_run do
    association :user
    association :prompt_set
    trait :for_listing do
      association :input_object, factory: :listing
    end
    trait :for_summary_fragment do
      association :input_object, factory: :summary_fragment
    end
  end
end

