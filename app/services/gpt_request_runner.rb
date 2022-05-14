class GptRequestRunner

  def initialize
    @content_filters = ContentFilters::Runner.new
    @translations    = Translations::Runner.new
  end

  def for(task_run_id, prompt_id)
    task_run = TaskRun.find(task_run_id)
    prompt   = Prompt.find(prompt_id)
    response = execute_request!(prompt, task_run)
    process_response(task_run, response, prompt)
  end

  private

  def execute_request!(prompt, task_run)
    if Rails.env.production? || ENV['LIVE_REQUESTS']
      gpt_call = GptCallGenerator.generate_for(prompt, task_run.input_object)
      gpt_call.execute!
    else
      mock_response(prompt)
      #mock_error_response
    end
  end

  def process_response(task_run, response, prompt)
    task_result = create_task_result(task_run, response, prompt)
    @content_filters.run(response, task_result, task_run)
    @translations.run(task_run, task_result)
    task_result
  end

  def create_task_result(task_run, response, prompt)
    task_run.task_results.create!(
      success: response[:success],
      prompt: prompt,
      result_text: response[:result_text],
      error: response[:error]
    )
  end

  def mock_response(prompt)
    text = "This is a mock #{prompt.prompt_set.request_type.upcase} response in development mode, advertising a wonderful stay in a 3 bed house in Malaga."
    {
      check_result: { decision: 'pass', label: '0', data: '' },
      success: true,
      result_text: "#{text} #{text}"
    }
  end

  def mock_error_response
    {
      success: false,
      error: "{\n  \"error\": {\n    \"message\": \"The server is currently overloaded with other requests. Sorry about that! You can retry your request, or contact support@openai.com if the error persists.\",\n    \"type\": \"server_error\",\n    \"param\": null,\n    \"code\": null\n  }\n}\n"
    }
  end
end
