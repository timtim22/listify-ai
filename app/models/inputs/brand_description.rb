class Inputs::BrandDescription < ApplicationRecord
  include Inputable

  self.table_name = 'brand_descriptions'

  has_many :task_runs, as: :input_object, dependent: :destroy
  has_many :task_results, through: :task_runs

  validates :request_type, presence: true

  def input_text
    "#{property_string}#{attractions_string}#{location_string}#{brand_string}"
  end

  def property_string
    if property_details.present?
      "About the properties: #{without_newlines(property_details)}\n"
    else
      ''
    end
  end

  def location_string
    if location_details.present?
      "About the location: #{without_newlines(location_details)}\n"
    else
      ''
    end
  end

  def attractions_string
    if attractions.any?
      "Attractions nearby: #{attractions.join(', ')}\n"
    else
      ''
    end
  end

  def brand_string
    if brand_details.present?
      "Other details: #{without_newlines(brand_details)}\n"
    else
      ''
    end
  end

  def without_newlines(field)
    field.gsub("\n", ', ')
  end
end
