class ApiSearchResult
  attr_reader :search_location, :selected_ids, :user_provided_area_name, :detail_text

  def initialize(params, detail_text)
    @search_location          = SearchLocation.find(params[:search_location_id])
    @selected_ids             = params[:selected_ids]
    @user_provided_area_name  = params[:user_provided_area_name]
    @detail_text              = detail_text
  end

  def call
    if invalid_place_ids.empty?
      create_area_description
    else
      { error: true, data: invalid_place_ids }
    end
  end

  private

  def create_area_description
    AreaDescription.new(
      request_type: 'area_description',
      search_location: search_location,
      user_provided_area_name: user_provided_area_name,
      detail_text: detail_text,
      input_data: {
        search_results: search_result_data,
        selected_ids: selected_ids
      }.to_json
    )
  end

  def invalid_place_ids
    @invalid_place_ids ||= selected_ids - all_place_ids
  end

  def search_result_data
    @search_result_data ||= search_location.search_results.order(created_at: :asc).last.results
  end

  def all_place_ids
    search_result_data.values.flatten.map { |result| result['place_id'] }
  end
end
