module ApiClients
  class Mock

    def run_request!(request_params, config)
      successful_response(request_params, config)
    end

    def successful_response(request_params, config)
      {
        service: Completion::Services::MOCK,
        success: true,
        result_text: request_details(request_params, config),
        should_check_content: false
      }
    end

    def request_details(request_params, config)
      req = JSON.parse(request_params)
      prompt = req['prompt']
      rest = format_param_list(req.except('prompt'))
      config_list = format_param_list(config)
      "Request info:\n\n#{prompt}\n\n---\nSettings:\n#{rest}\n\nConfig:\n#{config_list}"
    end

    def format_param_list(hash)
      hash.map { |k, v| "#{k}: #{v}" }.join("\n")
    end

    def error_response
      {
        service: Completion::Services::MOCK,
        success: false,
        error: "{\n  \"error\": {\n    \"message\": \"Mock Error: The server is currently overloaded with other requests. Generated from ApiClients::Mock.\",\n    \"type\": \"server_error\",\n    \"param\": null,\n    \"code\": null\n  }\n}\n"
      }
    end
  end
end
