FactoryBot.define do
  factory :summary_fragment, class: "Inputs::SummaryFragment" do
    input_text { "A 3 bedroom house in Malaga with a pool" }
    request_type { "test_request_1" }
  end
end


