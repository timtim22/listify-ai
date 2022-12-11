module ResponseFormatters
  class Runner
    def run(task_result, input_object_type)

      discard_whitespace_and_outer_quotes(task_result)

      return if input_object_type != 'Inputs::Advert'

      formatted_result_text = ResponseFormatters::List.format(task_result.result_text)
      task_result.update!(result_text: formatted_result_text)
    end

    def discard_whitespace_and_outer_quotes(task_result)
      return if task_result.result_text.blank?

      formatted = ResponseFormatters::Whitespace.format(task_result.result_text)
      task_result.update!(result_text: formatted) if formatted != task_result.result_text
    end
  end
end
