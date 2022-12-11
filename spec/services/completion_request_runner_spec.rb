RSpec.describe CompletionRequestRunner do

  describe 'Runs CompletionRequestRunner' do
    it 'Creates TaskResult with StepPrompt for Multitask' do
      input_object = create(:listing)
      user = create(:user)
      create(:input, user: user, inputable: input_object)
      task_run = create(:task_run, input_object: input_object, user: user)
      step_prompt = create('Step::Prompt')

      service = CompletionRequestRunner.new.for(task_run.id, step_prompt.id, true)

      expect(service.class.table_name).to eq 'task_results'
      expect(service.step_prompt_id).to eq step_prompt.id
    end

    it 'Creates TaskResult with Prompt empty for Multitask' do
      input_object = create(:listing)
      user = create(:user)
      create(:input, user: user, inputable: input_object)
      task_run = create(:task_run, input_object: input_object, user: user)
      step_prompt = create('Step::Prompt')

      service = CompletionRequestRunner.new.for(task_run.id, step_prompt.id, true)

      expect(service.prompt_id).to eq nil
    end
  end
end
