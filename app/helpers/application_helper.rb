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
end
