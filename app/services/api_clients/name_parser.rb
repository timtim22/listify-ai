class ApiClients::NameParser

  TOKEN = Rails.application.credentials.dig(:name_parser, :api_key)

  def get_name(firstname)
    url = "https://api.parser.name/?api_key=#{TOKEN}&endpoint=parse&name=#{firstname}"
    request('get', url, {}, {})
  end

  private

  def request(method, url, headers, body)
    response = HTTParty.send(method, *[url, {
      headers: headers,
      body: body,
      #debug_output: $stdout
    }])

    Rails.logger.debug 'NAME PARSE RESPONSE'
    Rails.logger.debug response
    Rails.logger.debug '------'

    if response.code == 200
      JSON.parse(response.body)
    else
      { error: response.body, success: false }
    end
  end
end

