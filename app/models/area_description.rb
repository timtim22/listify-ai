class AreaDescription < ApplicationRecord
  include Inputable

  belongs_to :search_location
  has_many :task_runs, as: :input_object, dependent: :destroy

  validates :request_type, presence: true
  validates :detail_text, length: { minimum: 0, maximum: 300 }
  validate :selected_ids, on: :create

  def self.new_from(params)
    AreaDescription.new(
      request_type: 'area_description',
      search_location: SearchLocation.find(params[:search_location_id]),
      detail_text: params[:detail_text],
      input_data: {
        search_results: params[:search_results],
        selected_ids: params[:selected_ids]
      }.to_json
    )
  end

  def displayable_input_text
    "- search area: #{search_location.search_text.titleize}\n" + input_text
  end

  def input_text
    AreaSearch::TextGenerator.input_text_for(self)
  end

  def selected_ids
    if JSON.parse(input_data)['selected_ids'].blank?
      errors.add(:attractions, 'No attractions were selected')
    end
  end

  def location
    search_location.search_text # used by call_generator
  end
end
