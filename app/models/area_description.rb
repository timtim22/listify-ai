class AreaDescription < ApplicationRecord
  include Inputable

  has_many :task_runs, as: :input_object, dependent: :destroy
  validates :request_type, presence: true

  def self.new_from(*args)
    AreaDescription.new(
      request_type: "area_description",
      input_data: {
        search_results: args.first["search_results"],
        selected_ids: args.first["selected_ids"]
      }.to_json
    )
  end

  def input_text
    "placeholder text"
  end
end
