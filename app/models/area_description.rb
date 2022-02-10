class AreaDescription < ApplicationRecord
  include Inputable

  belongs_to :search_location
  has_many :task_runs, as: :input_object, dependent: :destroy

  attr_accessor :selected_ids

  validates :request_type, presence: true
  validates :detail_text, length: { minimum: 0, maximum: 300 }
  validates :selected_ids, presence: { message: 'No attractions were selected' }, on: :create

  def self.new_from(params)
    AreaDescription.new(
      request_type: "area_description",
      search_location: SearchLocation.find(params[:search_location_id]),
      detail_text: params[:detail_text],
      selected_ids: params[:selected_ids], # virtual attr
      input_data: {
        search_results: params[:search_results],
        selected_ids: params[:selected_ids]
      }.to_json
    )
  end

  def displayable_input_text
    "Search: #{search_location.search_text.titleize}\n----\n" + input_text
  end

  def input_text
    AreaTextGenerator.input_text_for(self)
  end
end
