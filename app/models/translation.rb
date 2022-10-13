class Translation < ApplicationRecord
  belongs_to :translatable, polymorphic: true

  CLIENTS = [ApiClients::DeepL, ApiClients::AzureTranslate].freeze

  def self.client_for(output_language_code)
    CLIENTS.find { |c| c.supports_output_language?(output_language_code) }
  end

  def self.fetch_multiple!(output_language, translatable_objects)
    translatable_objects.map do |object|
      fetch_new!(output_language, object)
    end
  end

  def self.fetch_new!(output_language, translatable_object)
    response = client_for(output_language).new.translate('EN', output_language, translatable_object.result_text)
    translation = create_for!(translatable_object, response)
    trigger_completion_update(translation)
    translation
  end

  def self.create_for!(translatable_object, response_object)
    create!(
      translatable: translatable_object,
      from: response_object[:from],
      to: response_object[:to],
      result_text: response_object[:text],
      success: response_object[:success],
      error: response_object[:error]
    )
  end

  def self.trigger_completion_update(translation)
    translated_object = translation.translatable
    return unless translation.success? && translated_object.instance_of?(TaskResult)

    translated_object.reload
    RecordedCompletion.update_translations!(translated_object)
  end
end
