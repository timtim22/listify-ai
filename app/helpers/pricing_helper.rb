module PricingHelper
  TAGLINES = {
    starter: "Perfect for property managers just getting started",
    standard: "Perfect for small teams with a growing portfolio",
    premium: "Perfect for established teams working at scale",
    enterprise: "Customise Listify to your style and needs"
  }

  SPIN_COUNT = { #move to db
    starter: 20,
    standard: 100,
    premium: 1000
  }

  SEAT_COUNT = {
    starter: 1,
    standard: 3,
    premium: 5
  }

  def tagline_for(plan_name)
    TAGLINES[plan_name.downcase.to_sym]
  end

  def spin_count_for(plan_name)
    SPIN_COUNT[plan_name.downcase.to_sym]
  end

  def seat_count_for(plan_name)
    SEAT_COUNT[plan_name.downcase.to_sym]
  end
end
