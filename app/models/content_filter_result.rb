class ContentFilterResult < ApplicationRecord
  belongs_to :task_result

  def safe?
    label == "0"
  end

  def unsafe?
    label.present? && !safe?
  end
end
