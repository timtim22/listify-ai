module Users::CustomTrialEndDatesHelper
  def dates_to_extend_trial_options
    opts = (1..6).map { |i| Time.zone.today + i.weeks }
    opts.map { |date| [format_date_for_display(date), date] }
  end
end
