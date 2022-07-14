module ApplicationHelper
  include Pagy::Frontend

  def from_template(template)
    JSON.parse(render(template: template))
  end

  def from_partial(partial, options = {})
    JSON.parse(render(partial: partial, formats: [:json], locals: options))
  end

  def format_date_for_display(date)
    date && date.strftime('%A %d %B')
  end

  def format_table_date(date)
    date && date.localtime.strftime('%H:%M%P, %d %b')
  end

  def formatted_amount(amount, options = { unit: '£', precision: 2 })
    number_to_currency(amount.to_i / 100.0, options)
  end

  def module_enabled?(module_name)
    current_user.enabled_modules.include? module_name
  end

  TAGLINES = {
    starter: 'Perfect for property managers just getting started',
    standard: 'Perfect for small teams with a growing portfolio',
    premium: 'Perfect for established teams working at scale',
    enterprise: 'Customise Listify to your style and needs'
  }

  SPIN_COUNT = { #move to db
    starter: 75,
    standard: 250,
    premium: 1200
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
