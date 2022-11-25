class Procedures::MultistepRequestWorker
  include Sidekiq::Worker
  sidekiq_options retry: 0

  def perform(procedure_id, task_run_id)
    task_run = TaskRun.find_by(id: task_run_id)
    procedure = Procedure.find_by(id: procedure_id)

    procedure.registered_steps.each do |step|
      input = step.step_prompt.output
      output = step.step_prompt.run(task_run.id, step.step_prompt.id, step.last?, procedure, input)
      step.step_prompt.output = output.output['input']
    end
  end
end
