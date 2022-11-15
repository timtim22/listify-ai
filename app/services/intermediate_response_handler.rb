class IntermediateResponseHandler
  def initialize(task_run, prompt)
    @task_run = task_run
    @prompt = prompt
  end

  def run(task_run, prompt)
    create_inetermediate_result
  end

  def create_inetermediate_result
  end
end
