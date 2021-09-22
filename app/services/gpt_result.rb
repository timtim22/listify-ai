class GptResult

  def for(task_run_id, prompt_id)
    task_run = TaskRun.find(task_run_id)
    prompt   = Prompt.find(prompt_id)
    gpt_call = GptCallGenerator.generate_for(prompt, task_run.input_object)
    response = gpt_call.execute!
    #response = { check_result: { decision: "fail", label: "1", data: "" }, success: true, result_text: 'test' }
    #response = { success: true, result_text: 'test' }
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
      filter_result = create_filter_result(result, response[:check_result])
      #flag_result(filter_result)
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
