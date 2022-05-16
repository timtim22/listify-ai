module ResponseFormatters
  class Runner
    def run(task_result, input_object_type)
      return if input_object_type != 'Inputs::Advert'

      formatted_result_text = format_bullets(task_result.result_text)
      task_result.update!(result_text: formatted_result_text)
    end

    def format_bullets(text)
      # this may not get run if the request takes too long (no guard to not show results)
      formatted = text.strip
      return formatted unless formatted.starts_with? '1'

      formatted.split("\r\n").compact_blank.join("\r\n\r\n")
    end
  end
end
