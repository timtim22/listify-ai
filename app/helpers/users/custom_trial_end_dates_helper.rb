module Users::CustomTrialEndDatesHelper
  def dates_to_extend_trial_options
    today = Time.zone.today
    opts = [
      today + 1.week,
      today + 2.weeks,
      today + 3.weeks,
      today + 4.weeks,
      today + 5.weeks,
      today + 6.weeks
    ]
    opts.map { |date| [format_date_for_display(date), date] }
  end
end
