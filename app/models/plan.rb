class Plan < ApplicationRecord
  def self.public
    where.not(name: ['starter_dep', 'starter (2021)'])
      .where(interval: 'month')
      .order(:amount)
  end

  def default_spin_cap
    case name.downcase
    when 'starter', 'starter_dep', 'starter (2021)' then 75
    when 'standard' then 250
    when 'premium' then 1200
    else 0
    end
  end

  def default_seat_count
    case name.downcase
    when 'starter', 'starter_dep', 'starter (2021)' then 1
    when 'standard' then 3
    when 'premium' then 5
    else
      0
    end
  end
end
