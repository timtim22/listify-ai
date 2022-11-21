RSpec.describe Procedures::MultistepRequestWorker do

  describe 'Runs TaskRunners::Multistep' do
    it 'Creates TaskRun and execute Procedures::MultistepRequestWorker' do
      input_object = create(:listing)
      create(:user)
      task_run = create(:task_run, input_object: input_object)
      create('Step::Prompt')
      procedure = create(:procedure, title: 'Title Listing', tag: "Listing")
      expect(Procedures::MultistepRequestWorker).to receive(:perform_async).exactly(1).times
      worker = Procedures::MultistepRequestWorker.new
      worker.perform(procedure.id, task_run.id)

    end
  end
end
