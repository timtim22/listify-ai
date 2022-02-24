class Demo::DataMask
  attr_reader :real_attrs, :name_parser

  MALE_NAME = 'Johanes'.freeze
  FEMALE_NAME = 'Janett'.freeze
  SURNAME = 'Doxxe'.freeze
  CURRENT_COMPANIES = ['FakeCompany', 'NotaReal Inc', 'MadeUp Partners', 'Noone Executives', 'Imagined Co'].freeze
  PREV_COMPANIES = ['Nowhere Capital', 'Nonsuch Associates', 'NeverReal Affiliates', 'Invented Company', 'The Old Company'].freeze

  def initialize(real_attrs)
    @real_attrs = real_attrs
    @name_parser = ApiClients::NameParser.new
  end

  def obfuscate
    gender = gender_for(real_attrs.name)
    OpenStruct.new(
      name: obfuscate_name(gender),
      gender: gender,
      current_roles: obfuscate_companies(real_attrs.current_roles, CURRENT_COMPANIES, 'current'),
      previous_roles: obfuscate_companies(real_attrs.previous_roles, PREV_COMPANIES, 'previous'),
      educations: real_attrs.educations
    )
  end

  def obfuscate_name(gender)
    "#{gender == 'male' ? MALE_NAME : FEMALE_NAME} #{SURNAME}"
  end

  def gender_for(name)
    #gender = 'male'
    first_name = name.split(' ')[0]
    response = name_parser.get_name(first_name)
    gender = name_gender(response) || 'male'
  end

  def obfuscate_companies(roles, fakelist, list_type)
    roles
    #roles.map.with_index do |role, index|
      #if ['', ' ', '-'].include?(role['company'])
        #role
      #else
        #set_company_to_first_obscured(role, roles, fakelist, list_type)
      #end
    #end
  end

  def set_company_to_first_obscured(role, roles, fakelist, list_type)
    fake_role = role.dup
    if list_type == 'previous' && current_company_index_of(role['company'])
      current_company_index = current_company_index_of(role['company'])
      fake_role['company'] = CURRENT_COMPANIES[current_company_index]
    else
      first_occurrence = roles.find_index { |role_in_list| role_in_list['company'] == role['company'] }
      fake_role['company'] = fakelist[first_occurrence]
    end
    fake_role
  end

  def current_company_index_of(company)
    real_attrs.current_roles.find_index { |role| role['company'] == company }
  end

  def deobfuscate_results(task_run)
    task_run.task_results.pluck(:result_text).map { |r| deobfuscate_result(r) }
  end

  def deobfuscate_result(result_text)
    with_name = deobfuscate_name(result_text)
    #with_current_companies = deobfuscate_companies(with_name, real_attrs.current_roles, CURRENT_COMPANIES)
    #deobfuscate_companies(with_current_companies, real_attrs.previous_roles, PREV_COMPANIES)
  end

  def deobfuscate_name(text)
    text
      .gsub(MALE_NAME, real_attrs.name.split(' ').first)
      .gsub(FEMALE_NAME, real_attrs.name.split(' ').first)
      .gsub(SURNAME, real_attrs.name.split(' ').last)
  end

  def deobfuscate_companies(text, roles, fake_companies)
    fake_companies.each_with_index do |fake_company, index|
      break if index >= roles.count

      real_company = roles[index]['company']
      text.gsub!(fake_company, real_company)
    end
    text
  end

  def name_gender(data)
    begin
      data['data'].first['name']['firstname']['gender_formatted']
    rescue StandardError => e
      'male'
    end
  end
end
