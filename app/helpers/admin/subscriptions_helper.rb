module Admin::SubscriptionsHelper

  def mrr_count(subscriptions)
    active = subscriptions.select(&:active?)
    amount = formatted_amount(active.map(&:plan).sum(&:amount))
    sanitize("<span class='text-sm'> (approx #{amount} MRR, after VAT)</span>")
  end

  def format_plan_name(name)
    colors = {
      'starter': 'text-yellow-800',
      'starter (2021)': 'text-yellow-800',
      'starter_dep': 'text-yellow-800',
      'standard': 'text-purple-800',
      'premium': 'text-pink-800'
    }

    sanitize("<span class=#{colors[name.to_sym] || ''}>#{name}</span>")
  end

  def format_sub_status(status)
    color = status == 'active' ? 'text-green-600' : 'text-red-500'
    sanitize("<span class=#{color}>#{status}</span>")
  end
end
