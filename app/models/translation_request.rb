class TranslationRequest < ApplicationRecord
  belongs_to :task_run

  OUTPUT_LANGUAGES = [ "DA", "FR", "DE", "IT", "ES", "NL" ]

  def self.create_for!(output_language)
    if OUTPUT_LANGUAGES.include?(output_language)
      self.create(to: output_language)
    end
  end
end
