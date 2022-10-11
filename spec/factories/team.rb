FactoryBot.define do
  factory :team do
    name { 'Test Company' }
    custom_spin_count { 1000 }
    seat_count { 10 }
  end
end
