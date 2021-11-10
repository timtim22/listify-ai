class Translation < ApplicationRecord
  belongs_to :translatable, polymorphic: true

  def self.create_for!(translatable_object, response_object)
    self.create(
      translatable: translatable_object,
      from: response_object[:from],
      to: response_object[:to],
      result_text: response_object[:text]
    )
  end
end
