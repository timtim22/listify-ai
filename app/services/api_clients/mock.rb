module ApiClients
  class Mock

    def run_request!(request_params, config)
      successful_response
    end

    def successful_response
      {
        service: Completion::Services::MOCK,
        success: true,
        result_text: 'Successful response from ApiClients::Mock',
        should_check_content: false
      }
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
