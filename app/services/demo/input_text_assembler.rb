class Demo::InputTextAssembler

  def run(inputs)
    [
      "name: #{inputs.name}",
      current_roles_string(inputs.current_roles),
      previous_roles_string(inputs.previous_roles),
      education_string(inputs.educations),
      'summary:'
    ].compact.join("\n")
  end

  def current_roles_string(current_roles)
    current_roles.any? ? "current roles: #{role_string(current_roles)}" : nil
  end

  def previous_roles_string(previous_roles)
    previous_roles.any? ? "previous roles: #{role_string(previous_roles)}" : nil
  end

  def role_string(roles)
    roles.map { |r| format_role_string(r) }.join('; ')
  end

  def education_string(educations)
    return unless educations.any?

    positions = educations.map { |e| format_education_string(e) }.join('; ')
    "education: #{positions}"
  end

  def format_role_string(r)
    date_string = format_date_with_interval(r['date'])
    "#{r['title']} #{format_company_string(r['company'])}(#{date_string})"
  end

  def format_date_with_interval(date_string)
    date_string
    #dates = date_string.split('-').map(&:strip)
    #binding.pry
    #dates
  end

  def format_education_string(e)
    "#{e['course']} at #{e['institution']} (#{e['date']})"
  end

  def format_company_string(company)
    if ['', ' ', '-'].include?(company)
      ''
    else
      "at #{company} "
    end
  end
end
