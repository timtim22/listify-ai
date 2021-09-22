class GptResult

  def for(task_run_id, prompt_id)
    task_run = TaskRun.find(task_run_id)
    prompt   = Prompt.find(prompt_id)
    gpt_call = GptCallGenerator.generate_for(prompt, task_run.input_object)
    response = gpt_call.execute!
    #response = { check_result: { decision: "pass", label: "0", data: "" }, success: true, result_text: 'https://bbc.co.uk test' }
    #response = { success: true, result_text: ['', 'test'].sample }
    #sleep(5)
    create_task_result(task_run, response, prompt)
  end

  def create_task_result(task_run, response, prompt)
    result = task_run.task_results.create!(
      success: response[:success],
      prompt: prompt,
      result_text: response[:result_text],
      error: response[:error]
    )
    if response[:check_result]
      CustomResultFilter.run_for!(result)
      filter_result = create_filter_result(result, response[:check_result])
    end
  end

  def create_filter_result(result, filter_result)
    result.content_filter_results.create!(
      decision: filter_result[:decision],
      label: filter_result[:label],
      data: filter_result[:data],
    )
  end
end
