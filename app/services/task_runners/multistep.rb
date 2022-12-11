class TaskRunners::Multistep
  def run_for!(input_object, user, api_request = false)
    procedures = Procedure.procedure_for(input_object)

    raise_no_procedures(input_object) if procedures.empty?

    task_run = TaskRun.create_for(user, input_object, api_request, procedures.count)
    procedures.each do |procedure|
      Procedures::MultistepRequestWorker.perform_async(procedure.id, task_run.id)
    end
    task_run
  end

  def raise_no_procedures(input_object)
    raise "Multistep Runner: No procedures found for #{input_object.inspect}"
  end
end
