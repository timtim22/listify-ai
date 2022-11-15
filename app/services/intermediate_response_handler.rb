class IntermediateResponseHandler

  def run(task_run, response, prompt)
    intermediate_result = create_intermediate_result(task_run, response, prompt)
    intermediate_result.reload
  end

  def create_intermediate_result(task_run, response, prompt)
    task_run.intermediate_results.create!(
      error: response[:error],
      input: prompt,
      output: response[:result_text],
      position: ''
    )
  end
end
