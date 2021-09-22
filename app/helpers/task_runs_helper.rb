module TaskRunsHelper
  def format_results(results)
    results.map do |result|
      if result.safe?
        simple_format(result.result_text)
      else
        content_label = result.content_filter_results.first.label
        "<p class='text-red-700'>FILTERED (label #{content_label}): #{result.result_text}</p>"
      end
    end.join("<br />--<br />").html_safe
  end

end
