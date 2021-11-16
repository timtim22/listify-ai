class Translation < ApplicationRecord
  belongs_to :translatable, polymorphic: true

  def self.fetch_new!(to, translatable_object)
    response = DeepLClient.new.translate("EN", to, translatable_object.result_text)
    create_for!(translatable_object, response)
  end

  def self.create_for!(translatable_object, response_object)
    self.create(
      translatable: translatable_object,
      from: response_object[:from],
      to: response_object[:to],
      result_text: response_object[:text],
      success: response_object[:success],
      error: response_object[:error]
    )
  end
end
