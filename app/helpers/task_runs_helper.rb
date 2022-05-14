module TaskRunsHelper

  def displayable_input_text(input_object)
    if input_object.respond_to?(:displayable_input_text)
      input_object.displayable_input_text
    else
      input_object.input_text
    end
  end

  def format_results(text_results, task_results, prompts)
    [
      displayable_text_results(text_results),
      displayable_task_results(task_results, prompts)
    ].flatten.join("<br />--<br />").html_safe
  end

  def displayable_text_results(text_results)
    text_results.map { |tr| display_result(tr, "non-gpt result") }
  end

  def displayable_task_results(task_results, prompts)
    task_results_with_prompts(task_results, prompts).map do |result_with_prompt|
      result = result_with_prompt[:result]
      if !result.success?
        display_error(result, result_with_prompt[:prompt_title])
      elsif result.safe?
        display_result(result, result_with_prompt[:prompt_title], result.translations)
      else
        display_filtered(result)
      end
    end
  end

  def task_results_with_prompts(results, prompts)
    results
      .map { |result| result_with_prompt_obj(result, prompts) }
      .sort_by! { |r| r[:position] || 0 }
  end

  def result_with_prompt_obj(result, prompts)
    prompt = prompts.find_by(id: result.prompt_id)
    { position: prompt&.position, prompt_title: prompt&.title, result: result }
  end

  def display_result(result, prompt_title, translations)
    result_text = text_with_translation(result, translations)
    display_text = simple_format(result_text)
    formatted_result = "<div>#{display_text}#{title_html(prompt_title)}</div>"
    result.user_copied? ? display_copied(formatted_result) : formatted_result
  end

  def display_error(result, prompt_title)
    error = result.error.starts_with?('<html>') ? result.error : JSON.parse(result.error)
    display_text = "<p class='text-red-700'>#{error}</p>"
    formatted_result = "<div>#{display_text}#{title_html(prompt_title)}</div>"
  end

  def display_copied(formatted_result)
    "<div class='text-green-600'>USER COPIED: #{formatted_result}</div>"
  end

  def title_html(title)
    "<span class='font-medium text-purple-800'>#{title}</span>"
  end

  def display_filtered(result)
    filtered_warning ="FILTERED (#{fail_reason_text(result)}):"
    "<p class='text-red-700'>#{filtered_warning} #{result.result_text}</p>"
  end

  def text_with_translation(result, translations)
    if translations.any?
      tr_strings = translations.map do |translation|
        "#{translation.to}: #{translation.result_text} \n"
      end
      "#{tr_strings.join('')} EN: #{result.result_text}"
    else
      result.result_text
    end
  end

  def fail_reason_text(result)
    if result.failed_custom_filter?
      "failed custom filter"
    else
      "label: #{result.content_filter_results.first.label}"
    end
  end
end
