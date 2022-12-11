class CompletionResponseHandler
  def initialize
    @content_filters     = ContentFilters::Runner.new
    @translations        = Translations::Runner.new
    @response_formatter  = ResponseFormatters::Runner.new
  end

  def run(task_run, response, prompt, request, config, procedure)
    task_result = TaskResult.create_for(task_run, response, prompt, procedure)
    @content_filters.run(response, task_result, task_run)
    @translations.run(task_run, task_result)
    @response_formatter.run(task_result, task_run.input_object_type)
    RecordedCompletion.create_for(task_run, task_result, request, config)
    task_result.reload
  end
end
