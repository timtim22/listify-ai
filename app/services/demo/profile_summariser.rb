class Demo::ProfileSummariser

  def initialize(params)
    profile_attrs = Demo::ProfileParamParser.new(params).run
    @data_mask = Demo::DataMask.new(profile_attrs)
    @input_text_assembler = Demo::InputTextAssembler.new
    @task_runner = TaskRunners::OneStepSync.new
  end

  def run!
    obfuscated_inputs = @data_mask.obfuscate
    input_text = @input_text_assembler.run(obfuscated_inputs)
    run_gpt_request(input_text)
  end

  def run_gpt_request(input_text)
    user = User.find_by(email: 'test2@venturerocket.co.uk')
    input_object = new_input_object(input_text)
    input = Input.create_with(input_object, user)
    if input.success
      task_run = @task_runner.run_for!(input.input_object, user, nil)
      success_response(task_run)
    else
      input
    end
  end

  def new_input_object(input_text)
    Inputs::GenericInput.new(
      request_type: 'recruitment_extension',
      input_text: input_text
    )
  end

  def success_response(task_run)
    OpenStruct.new(
      success: true,
      task_run_id: task_run.id,
      task_results: @data_mask.deobfuscate_results(task_run)
    )
  end
end
