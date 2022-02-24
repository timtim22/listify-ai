class Demo::ProfileParamParser
  attr_reader :params

  def initialize(params)
    @params = JSON.parse(params)
  end

  def run
    current_roles, previous_roles = split_roles_by_type
    OpenStruct.new(
      name: format_name(params['name']),
      current_roles: format_roles(current_roles),
      previous_roles: format_roles(previous_roles),
      educations: educations_from_params
    )
  end

  def format_roles(roles)
    roles.map do |role|
      role['company'] = trim_content(role['company']);
      #role['date'] = trim_content(role['date']);
      role
    end
  end

  def format_name(string)
    string.gsub(/^[\(\)\d]+/, '').strip
  end

  def trim_content(string)
    string.split('·')[0].strip
  end

  def split_roles_by_type
    roles_from_params.partition { |r| r['date'].include? 'Present' }
  end

  def roles_from_params
    params['rolesData'].select { |r| r['id'].include? 'role' }
  end

  def educations_from_params
    params['rolesData'].select { |r| r['id'].include? 'education' }
  end
end
