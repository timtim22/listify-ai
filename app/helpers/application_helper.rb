module ApplicationHelper
  include Pagy::Frontend

  def from_template(template)
    JSON.parse(render(template: template))
  end

  def from_partial(partial, options = {})
    JSON.parse(render(partial: partial, locals: options))
  end

  def format_table_date(date)
    date.localtime.strftime("%H:%M%P, %d %b")
  end

  def formatted_amount(amount, options={ unit: "£" })
    number_to_currency(amount.to_i / 100.0, options)
  end

  def subscription_plan_from_id(id)
    plans = {
      price_1K5FN2AAShUZq81IpSbu8SjG: "Starter (monthly)",
      price_1K5FVQAAShUZq81ICYJy725r: "Starter (annual)",
      price_1K5FPWAAShUZq81ILS6ZCY4x: "Professional (monthly)",
      price_1K5FPrAAShUZq81IxdUzzDE2: "Test (daily billing)"
    }

    plans[id.to_sym]
  end
end
