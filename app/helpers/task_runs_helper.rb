module TaskRunsHelper
  def format_results(results, prompts)
    sorted_results = sort_results_with_prompts(results, prompts)
    sorted_results.map do |result_with_prompt|
      result = result_with_prompt[:result]
      if result.safe?
        formatted_result = display_result(result, result_with_prompt[:position])
        result.user_copied? ? display_copied(formatted_result) : formatted_result
      else
        display_filtered(result)
      end
    end.join("<br />--<br />").html_safe
  end

  def sort_results_with_prompts(results, prompts)
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
    "<div>#{result_text}#{title_html}</div>"
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
