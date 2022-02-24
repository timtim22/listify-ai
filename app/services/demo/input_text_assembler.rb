class Demo::InputTextAssembler

  def run(inputs)
    #binding.pry
    run_alt(inputs)
    #[
      #"name: #{inputs.name}",
      #current_roles_string(inputs.current_roles),
      #previous_roles_string(inputs.previous_roles),
      #education_string(inputs.educations),
      #'summary:'
    #].compact.join("\n")
  end

  def run_alt(inputs)
    a = current_role_line(inputs.name, inputs.current_roles)
    b = previous_role_line(first_name(inputs.name), inputs.previous_roles)
    c = education_line(first_name(inputs.name), inputs.educations)
    a + b + c
  end

  def first_name(name)
    name.split(' ')[0]
  end

  def current_role_line(name, current_roles)
    if current_roles.any?
      "#{name} is #{current_roles_joined(name, current_roles)}. "
    else
      ''
    end
  end

  def previous_role_line(name, previous_roles)
    if previous_roles.any?
      "#{name} was previously #{previous_roles_joined(name, previous_roles)}. "
    else
      ''
    end
  end

  def education_line(name, educations)
    if educations.any?
      positions = educations.map { |e| format_education_string(e) }.join('; ')
      "#{name}'s education: #{positions}."
    else
      ''
    end
  end

  def current_roles_joined(name, roles)
    roles.map { |r| new_role_string(r, 'current') }.join(". #{first_name(name)} is also ")
  end

  def previous_roles_joined(name, roles)
    roles.map { |r| new_role_string(r, 'previous') }.join(". #{first_name(name)} was also ")
  end

  def new_role_string(role, roles_type)
    date_string = current_role_date_string(role['date'], roles_type)
    "#{role['title']} #{format_company_string(role['company'])}#{date_string}"
  end

  def current_role_date_string(date, roles_type)
    if roles_type == 'current'
      start = date.split(' - ')[0]
      "since #{start}"
    else
      "for #{date.split('·')[1].strip}".gsub('yr', 'year').gsub('mo', 'month')
    end
  end

  def current_roles_string(current_roles)
    if current_roles.any?
      "current roles: #{role_string(current_roles)}"
    end
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
