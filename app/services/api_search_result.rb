class ApiSearchResult

  def initialize(params, detail_text)
    @search_location_id       = params[:search_location_id]
    @selected_ids             = params[:selected_ids]
    @user_provided_area_name  = params[:user_provided_area_name]
    @detail_text              = detail_text
  end

  def call
    return { error: true, data: invalid_place_ids } if invalid_place_ids.present?

    search_location = SearchLocation.find_by(id: @search_location_id)
    search_result = search_location.search_results.order(created_at: :asc).last.results
    input_data = {
      search_results: search_result,
      selected_ids: @selected_ids
    }.to_json
    create_area_description(search_location, @user_provided_area_name, @detail_text, input_data)
  end

  private

  def create_area_description(search_location, user_provided_area_name, detail_text, input_data)
    AreaDescription.new(
      request_type: 'area_description',
      search_location: search_location,
      user_provided_area_name: user_provided_area_name,
      detail_text: detail_text,
      input_data: input_data
    )
  end

  def invalid_place_ids
    if @selected_ids.present?
      place_ids = []
      invalid_selected_ids = []
      input_data = SearchLocation.find_by(id: @search_location_id).search_results.order(created_at: :asc).last.results
      input_data.map do |key, results|
        results.map do |result|
          place_ids << result['place_id']
        end
      end

      @selected_ids.each do |selected_id|
        invalid_selected_ids << selected_id unless place_ids.include? selected_id
      end

      invalid_selected_ids
    end
  end
end
