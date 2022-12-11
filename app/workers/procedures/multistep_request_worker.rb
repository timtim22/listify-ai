class Procedures::MultistepRequestWorker
  include Sidekiq::Worker
  sidekiq_options retry: 0

  def perform(procedure_id, task_run_id)
    task_run = TaskRun.find_by(id: task_run_id)
    procedure = Procedure.find_by(id: procedure_id)

    input = task_run.input_object
    procedure.registered_steps.each do |step|
      input = OpenStruct.new(input_text: input)
      output = step.step_prompt.run(task_run.id, step.step_prompt.id, step.last?, procedure, input)
      input = output.output['input'] unless step.last?
    end
  end
end
