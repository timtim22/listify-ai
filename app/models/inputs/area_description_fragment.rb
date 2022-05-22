class Inputs::AreaDescriptionFragment < ApplicationRecord
  include Inputable

  self.table_name = 'area_description_fragments'

  belongs_to :search_location
  has_many :task_runs, as: :input_object, dependent: :destroy
  has_many :task_results, through: :task_runs

  validates :request_type, presence: true
  validates :detail_text, length: { minimum: 0, maximum: 300 }
  validate :selected_ids, on: :create

  def self.new_from(params)
    Inputs::AreaDescriptionFragment.new(
      request_type: 'area_description_fragment',
      search_location: SearchLocation.find(params[:search_location_id]),
      detail_text: params[:detail_text],
      input_data: {
        search_results: params[:search_results],
        selected_ids: params[:selected_ids]
      }.to_json
    )
  end

  def search_location_text
    search_location.search_text
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
    search_location.search_text
  end
end
