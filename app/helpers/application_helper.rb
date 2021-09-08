module ApplicationHelper

  def format_table_date(date)
    date.localtime.strftime("%H:%M%P, %d %b")
  end
end
