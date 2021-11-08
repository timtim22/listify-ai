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
      if result.safe?
        display_result(result, result_with_prompt[:prompt_title])
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

  def display_result(result, prompt_title)
    result_text = simple_format(result.result_text)
    title_html = "<span class='font-medium text-purple-800'>#{prompt_title}</span>"
    formatted_result = "<div>#{result_text}#{title_html}</div>"
    result.user_copied? ? display_copied(formatted_result) : formatted_result
  end

  def display_copied(formatted_result)
    "<div class='text-green-600'>USER COPIED: #{formatted_result}</div>"
  end

  def display_filtered(result)
    filtered_warning ="FILTERED (#{fail_reason_text(result)}):"
    "<p class='text-red-700'>#{filtered_warning} #{result.result_text}</p>"
  end

  def fail_reason_text(result)
    if result.failed_custom_filter?
      "failed custom filter"
    else
      "label: #{result.content_filter_results.first.label}"
    end
  end
end
