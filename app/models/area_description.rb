class AreaDescription < ApplicationRecord
  include Inputable

  belongs_to :search_location
  has_many :task_runs, as: :input_object, dependent: :destroy

  def update_form(selected_ids, detail_text, user_provided_area_name=nil)
    search_results = get_input_data
    input_data = {
      search_results: search_results,
      selected_ids: selected_ids
    }.to_json

    self.update(
      user_provided_area_name: user_provided_area_name,
      detail_text: detail_text,
      input_data: input_data
    )
  end

  def get_input_data
    JSON.parse(self.input_data)['search_results']
  rescue
    self.input_data
  end

  def displayable_input_text
    "- search area: #{location.titleize}\n" + input_text
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
    user_provided_area_name || search_location.search_text # used by call_generator
  end
end
