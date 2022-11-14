module RequestAssemblers
  class Coordinate
    class << self
      def for(prompt, input_object, mock_request)
        client_name = client_name(input_object, prompt, mock_request)
        prompt_body = assemble_prompt_body(prompt.content, input_object)
        request = assemble_request_parameters(client_name, prompt, prompt_body, input_object)
        config = assemble_config(client_name, prompt)
        [request, config]
      end

      def assemble_prompt_body(input_text, input_object)
        case input_object.class.to_s
        when CustomInput
          RequestAssemblers::CustomInput
        when 'Inputs::BrandDescription'
          RequestAssemblers::Brand
        when 'AreaDescription', 'Inputs::AreaDescriptionFragment'
          RequestAssemblers::Area
        else
          RequestAssemblers::Input
        end.prompt(input_text, input_object)
      end

      def assemble_request_parameters(client_name, prompt, prompt_body, input_object)
        if client_name == Completion::Services::AI21
          RequestAssemblers::Ai21.parameters(prompt, prompt_body, input_object)
        elsif client_name == Completion::Services::COHERE
          RequestAssemblers::Cohere.parameters(prompt, prompt_body, input_object)
        elsif model_request?(prompt)
          RequestAssemblers::GptModel.parameters(prompt, prompt_body, input_object)
        else
          RequestAssemblers::GptText.parameters(prompt, prompt_body, input_object)
        end
      end

      def assemble_config(client_name, prompt)
        {
          client_name: client_name,
          engine: prompt.engine,
          model: prompt.remote_model_id,
          prompt_title: prompt.title,
          check_content: should_check_content?(client_name)
        }
      end

      def should_check_content?(client_name)
        Constants.live_requests? && client_name == Completion::Services::GPT
      end

      def client_name(input_object, prompt, mock_request)
        if Constants.live_requests_disabled? || mock_request
          Completion::Services::MOCK
        elsif input_object.respond_to?(:client)
          input_object.client
        else
          prompt.service
        end
      end

      def model_request?(prompt)
        prompt.remote_model_id.present?
      end
    end
  end

  class CustomInput
    def self.===(item)
      item.starts_with? 'CustomInput'
    end
  end
end
