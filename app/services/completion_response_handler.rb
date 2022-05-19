class CompletionResponseHandler
  def initialize
    @content_filters     = ContentFilters::Runner.new
    @translations        = Translations::Runner.new
    @response_formatter  = ResponseFormatters::Runner.new
  end

  def run(task_run, response, prompt)
    task_result = create_task_result(task_run, response, prompt)
    @content_filters.run(response, task_result, task_run)
    @translations.run(task_run, task_result)
    @response_formatter.run(task_result, task_run.input_object_type)
    task_result.reload
  end

  def create_task_result(task_run, response, prompt)
    task_run.task_results.create!(
      service: response[:service],
      success: response[:success],
      prompt: prompt,
      result_text: response[:result_text],
      error: response[:error]
    )
  end
end
