class TaskResult < ApplicationRecord
  belongs_to :task_run
  belongs_to :prompt, optional: true
  belongs_to :step_prompt, optional: true, class_name: 'Step::Prompt'

  has_one :recorded_completion, dependent: :nullify
  has_many :content_filter_results, dependent: :destroy
  has_many :translations, as: :translatable, dependent: :destroy


  def record_copy_event!
    recorded_completion&.update!(completion_copied: true)
    update!(user_copied: true)
  end

  def filtered_result_text
    if safe?
      result_text
    else
      'This result was flagged as sensitive or unsafe. This may be a mistake - we are looking into it.'
    end
  end

  def self.create_for(task_run, response, prompt, multistep)
    if multistep
      task_run.task_results.create!(
        service: response[:service],
        success: response[:success],
        step_prompt: prompt,
        result_text: response[:result_text],
        error: response[:error]
      )
    else
      task_run.task_results.create!(
        service: response[:service],
        success: response[:success],
        prompt: prompt,
        result_text: response[:result_text],
        error: response[:error]
      )
    end
  end

  def safe?
    !awaiting_filter? && !failed_any_filter?
  end

  def failed_any_filter?
    failed_custom_filter? || failed_content_filter?
  end

  def failed_content_filter?
    content_filter_results.any?(&:unsafe?)
  end

  def still_processing?
    awaiting_filter? || awaiting_translation?
  end

  def awaiting_filter?
    service == Completion::Services::GPT &&
      Constants.live_requests? &&
      content_filter_results.empty?
  end

  def awaiting_translation?
    task_run.translation_requests.count > translations.count
  end
end
