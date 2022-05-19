module RequestAssemblers
  class Coordinate
    CHECK_CONTENT = ENV['CONTENT_CHECK_ENABLED'] || ENV['LIVE_REQUESTS']

    class << self
      def for(prompt, input_object)
        prompt_body = assemble_prompt_body(prompt.content, input_object)
        request = assemble_request_parameters(prompt, prompt_body, input_object)
        config = assemble_config(prompt)
        [request, config]
      end

      def assemble_prompt_body(input_text, input_object)
        case input_object.class.to_s
        when 'CustomInputs::OyoOne'
          RequestAssemblers::CustomInput
        when 'Inputs::BrandDescription'
          RequestAssemblers::Brand
        when 'AreaDescription', 'Inputs::AreaDescriptionFragment'
          RequestAssemblers::Area
        else
          RequestAssemblers::Input
        end.prompt(input_text, input_object)
      end

      def assemble_request_parameters(prompt, prompt_body, input_object)
        if model_request?(prompt)
          RequestAssemblers::GptModel.parameters(prompt, prompt_body, input_object)
        else
          RequestAssemblers::GptText.parameters(prompt, prompt_body, input_object)
        end
      end

      def assemble_config(prompt)
        {
          client_name: 'Gpt',
          engine: prompt.engine,
          model: prompt.gpt_model_id,
          check_content: CHECK_CONTENT
        }
      end

      def model_request?(prompt)
        prompt.gpt_model_id.present?
      end
    end
  end
end
