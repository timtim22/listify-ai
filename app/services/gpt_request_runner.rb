class GptRequestRunner

  def initialize
    @custom_filter = CustomResultFilter
    @client        = DeepLClient.new
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
    end
  end

  def process_response(task_run, response, prompt)
    task_result = create_task_result(task_run, response, prompt)
    store_filter_responses(response, task_result, task_run)
    translate(task_run, task_result)
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

  def store_filter_responses(response, task_result, task_run)
    if response[:check_result]
      filter_result = create_filter_result(task_result, response[:check_result])
      UserLock.run!(task_run.user) if filter_result.unsafe?
      run_through_custom_filter(task_result)
    end
  end

  def run_through_custom_filter(task_result)
    @custom_filter.run_for!(task_result)
  end

  def create_filter_result(result, filter_result)
    result.content_filter_results.create!(
      decision: filter_result[:decision],
      label: filter_result[:label],
      data: filter_result[:data],
    )
  end

  def translate(task_run, task_result)
    task_run.translation_requests.each do |req|
      response = @client.translate(req.from, req.to, task_result.result_text)
      Translation.create_for!(task_result, response)
    end
  end

  def mock_response(prompt)
    text = "This is a mock #{prompt.prompt_set.request_type.upcase} response in development mode, advertising a wonderful stay in a 3 bed house in Malaga."
    {
      check_result: { decision: 'pass', label: '0', data: '' },
      success: true,
      result_text: "#{text} #{text}"
    }
  end
end
