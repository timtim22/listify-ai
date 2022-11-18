class TaskRunners::Multistep
  def run_for!(input_object, user, api_request = false)
    procedures = Procedure.procedure_for(input_object)
    task_run   = create_task_run(user, input_object, api_request, procedures.count)

    procedures.each do |procedure|
      Procedures::MultistepRequestWorker.perform_async(procedure.id, task_run.id)
    end
    task_run
  end

  def create_task_run(user, input_object, api_request, procedure_count)
    task_run = TaskRun.create!(
      user: user,
      input_object: input_object,
      expected_results: procedure_count,
      api_request: api_request
    )
    task_run
  end
end
