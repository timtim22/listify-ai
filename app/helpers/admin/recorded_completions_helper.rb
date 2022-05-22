module Admin
  module RecordedCompletionsHelper

    def input_text(record)
      if record.untranslated_input_text.present?
        "#{record.input_language_code} (original):\n#{record.untranslated_input_text}\n\nEN (translated):\n#{record.input_text_snapshot}"
      else
        record.input_text_snapshot
      end
    end

    def completion_text(record)
      if record.result_error.present?
        display_error(record.result_error, record.prompt_title)
      elsif record.failed_filter?
        display_filtered(record.completion_text, record.prompt_title)
      elsif record.completion_copied?
        display_copied(record.completion_text, record.prompt_title)
      else
        display_normal(record.completion_text, record.prompt_title)
      end
    end

    def display_error(error, prompt_title)
      error_msg = error.starts_with?('<html>') ? error : JSON.parse(error)
      formatted_error = "<p class='text-red-700'>#{error_msg}</p>"
      "<div>#{formatted_error}#{formatted_title(prompt_title)}</div>"
    end

    def display_normal(completion_text, prompt_title)
      display_text = simple_format(completion_text)
      "<div>#{display_text}#{formatted_title(prompt_title)}</div>"
    end

    def display_copied(completion_text, prompt_title)
      content = display_normal(completion_text, prompt_title)
      "<div class='text-green-600'>USER COPIED: #{content}</div>"
    end

    def display_filtered(completion_text, prompt_title)
      content = display_normal(completion_text, prompt_title)
      "<div class='text-red-700'>FAILED FILTER: #{content}</div>"
    end

    def formatted_title(title)
      "<span class='font-medium text-purple-800'>#{title}</span>"
    end
  end
end
