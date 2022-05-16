module ResponseFormatters
  class Runner
    def run(task_result, input_object_type)
      return if input_object_type != 'Inputs::Advert'

      formatted_result_text = ResponseFormatters::List.format(task_result.result_text)
      task_result.update!(result_text: formatted_result_text)
    end
  end
end
