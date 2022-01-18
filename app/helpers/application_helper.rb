module ApplicationHelper
  include Pagy::Frontend

  def from_template(template)
    JSON.parse(render(template: template))
  end

  def from_partial(partial, options = {})
    JSON.parse(render(partial: partial, locals: options))
  end

  def format_date_for_display(date)
    date.strftime("%A %d %B")
  end

  def format_table_date(date)
    date.localtime.strftime("%H:%M%P, %d %b")
  end

  def formatted_amount(amount, options={ unit: "£", precision: 2 })
    number_to_currency(amount.to_i / 100.0, options)
  end
end
