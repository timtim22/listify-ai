class Plan < ApplicationRecord
  def self.public
    where.not(name: 'starter_dep')
      .where(interval: 'month')
      .order(:amount)
  end

  def monthly_spin_cap
    case name.downcase
    when "starter" then 30
    when "standard" then 250
    when "enterprise" then 1000
    else 0
    end
  end
end
