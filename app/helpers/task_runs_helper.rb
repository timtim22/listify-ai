module TaskRunsHelper
  def format_results(results)
    results.map do |result|
      if result.safe?
        simple_format(result.result_text)
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
