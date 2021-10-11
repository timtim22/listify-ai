module TaskRunsHelper
  def format_results(results)
    results.map do |result|
      if result.safe?
        result_text = simple_format(result.result_text)
        if result.user_copied?
        "<div class='text-green-600'>USER COPIED: #{result_text}</div>"
        else
          result_text
        end
      else
        filtered_warning ="FILTERED (#{fail_reason_text(result)}):"
        "<p class='text-red-700'>#{filtered_warning} #{result.result_text}</p>"
      end
    end.join("<br />--<br />").html_safe
  end

  def fail_reason_text(result)
    if result.failed_custom_filter?
      "failed custom filter"
    else
      "label: #{result.content_filter_results.first.label}"
    end
  end
end
