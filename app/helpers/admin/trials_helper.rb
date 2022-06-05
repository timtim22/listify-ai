module Admin::TrialsHelper

  def format_trial_status(status)
    colors = {
      'active_trial': 'text-green-800',
      'private_beta': 'text-purple-800',
      'lapsed_trial': 'text-red-800',
    }

    sanitize("<span class=#{colors[status.to_sym] || ''}>#{status}</span>")
  end

  def format_trial_end_date(date)
    ending_soon = date > Time.zone.now && date < Time.zone.now + 7.days
    color = ending_soon ? 'text-yellow-600' : ''
    sanitize("<span class=#{color}>#{format_date_for_display(date)}</span>")
  end
end

