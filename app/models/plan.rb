class Plan < ApplicationRecord
  def self.public
    where.not(name: ['starter_dep', 'starter (2021)'])
      .where(interval: 'month')
      .order(:amount)
  end

  def monthly_spin_cap
    case name.downcase
    when 'starter' then 30
    when 'starter_dep' then 30
    when 'starter (2021)' then 30
    when 'standard' then 200
    when 'enterprise' then 1000
    else 0
    end
  end
end
