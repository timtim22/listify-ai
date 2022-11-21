RSpec.describe TaskRunners::Multistep do

  describe 'Runs TaskRunners::Multistep' do
    it 'Creates TaskRun and execute Procedures::MultistepRequestWorker' do
      input_object = create(:listing)
      user = create(:user)
      task_run = create(:task_run, input_object: input_object)
      step_prompt = create('Step::Prompt')
      procedure = create(:procedure, title: "Title Listing", tag: "Listing")
      create(:registered_step, procedure: procedure, step: step_prompt)
      create(:input, user: user, inputable: input_object)

      expect(Procedures::MultistepRequestWorker).to receive(:perform_async)
      service = TaskRunners::Multistep.new.run_for!(input_object, user, true)

      worker = Procedures::MultistepRequestWorker.new
      worker.perform(procedure.id, task_run.id)

      expect(service.class.table_name).to eq 'task_runs'
      expect(service.input_object_type).to eq 'Listing'
    end
  end
end
