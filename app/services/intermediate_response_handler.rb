class IntermediateResponseHandler

  def run(task_run, response, prompt)
    intermediate_result = create_intermediate_result(task_run, response, prompt)
    intermediate_result.reload
  end

  def create_intermediate_result(task_run, response, prompt)
    task_run.intermediate_results.create!(
      error: response[:error],
      input: { input: prompt.id },
      output: { input: response[:result_text] },
      position: position_count(task_run)
    )
  end

  def position_count(task_run)
    task_run.intermediate_results.count + 1
  end
end
