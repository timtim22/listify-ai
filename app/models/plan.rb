class Plan < ApplicationRecord
  def monthly_spin_cap
    case name.downcase
    when "starter" then 20
    when "standard" then 100
    when "enterprise" then 1000
    else 0
    end
  end
end
