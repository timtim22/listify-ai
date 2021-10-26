FactoryBot.define do
  factory :search_location do
    search_text { "MyString" }
    latitude { 1.5 }
    longitude { 1.5 }
  end
end
