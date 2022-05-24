module ContentFilters
  class Runner

    def run(response, task_result, task_run)
      run_custom_filter(task_result)

      return unless should_run_gpt_filter?(response, task_result)

      filter_result = run_gpt_filter(response, task_result)
      UserLock.run!(task_run.user) if filter_result.unsafe?
    end

    def should_run_gpt_filter?(response, task_result)
      response[:should_check_content] &&
        task_result.service == Completion::Services::GPT
    end

    def run_gpt_filter(response, task_result)
      filter_response = ContentFilters::Gpt.run_for!(response)
      create_filter_result(task_result, filter_response)
    end

    def create_filter_result(task_result, filter_result)
      task_result.content_filter_results.create!(
        decision: filter_result[:decision],
        label: filter_result[:label],
        data: filter_result[:data],
      )
    end

    def run_custom_filter(task_result)
      ContentFilters::Custom.run_for!(task_result)
    end
  end
end
