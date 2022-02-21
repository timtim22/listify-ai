class Demo::DataMask
  attr_reader :real_attrs, :name_parser

  MALE_NAME = 'Johanes'.freeze
  FEMALE_NAME = 'Janett'.freeze
  SURNAME = 'Doxxe'.freeze
  CURRENT_COMPANIES = ['FakeCompany', 'NotaReal Inc', 'MadeUp Partners'].freeze
  PREV_COMPANIES = ['Nowhere Capital', 'Nonsuch Associates', 'NeverReal Affiliates', 'The Old Company'].freeze

  def initialize(real_attrs)
    @real_attrs = real_attrs
    @name_parser = ApiClients::NameParser.new
  end

  def obfuscate
    OpenStruct.new(
      name: obfuscate_name,
      current_roles: obfuscate_companies(real_attrs.current_roles, CURRENT_COMPANIES),
      previous_roles: obfuscate_companies(real_attrs.previous_roles, PREV_COMPANIES),
      educations: real_attrs.educations
    )
  end

  def obfuscate_name
    first_name = real_attrs.name.split(' ')[0]
    #response = name_parser.get_name(first_name)
    #gender = name_gender(response) || 'male'
    gender = 'male'
    "#{gender == 'male' ? MALE_NAME : FEMALE_NAME} #{SURNAME}"
  end

  def obfuscate_companies(roles, fakelist)
    roles.map.with_index do |role, index|
      if ['', ' ', '-'].include?(role['company'])
        role
      else
        fake_role = role.dup
        fake_role['company'] = fakelist[index]
        fake_role
      end
    end
  end

  def deobfuscate_results(task_run)
    task_run.task_results.pluck(:result_text).map { |r| deobfuscate_result(r) }
  end

  def deobfuscate_result(result_text)
    with_name = deobfuscate_name(result_text)
    with_current_companies = deobfuscate_companies(with_name, real_attrs.current_roles, CURRENT_COMPANIES)
    with_all_companies = deobfuscate_companies(with_current_companies, real_attrs.previous_roles, PREV_COMPANIES)
    with_all_companies
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
