class TaskRunners::Multistep
  def run_for!(input_object, user, api_request = false)
    procedures = Procedure.procedure_for(input_object)
    task_run   = TaskRun.create_for(user, input_object, api_request, procedures.count)
    procedures.each do |procedure|
      Procedures::MultistepRequestWorker.perform_async(procedure.id, task_run.id)
    end
    task_run
  end
end
