module Admin::SubscriptionsHelper

  def mrr_count(subscriptions)
    amount = formatted_amount(subscriptions.map(&:plan).sum(&:amount))
    sanitize("<span class='text-sm'> (approx #{amount} MRR, exc VAT)</span>")
  end

  def format_plan_name(name)
    color = case name
            when 'starter' then 'text-yellow-800'
            when 'standard' then 'text-purple-800'
            when 'premium' then 'text-pink-800'
            end

    sanitize("<span class=#{color}>#{name}</span>")
  end

  def format_sub_status(status)
    color = status == 'active' ? 'text-green-600' : 'text-red-500'
    sanitize("<span class=#{color}>#{status}</span>")
  end
end
