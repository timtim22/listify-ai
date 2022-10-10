class ApiAreaDescriptionValidation
  DETAIL_TEXT_CHARS_COUNT = 100

  def initialize(area_description, params)
    @params             = params
    @selected_ids       = @params['selected_ids']
    @detail_text        = @params['detail_text']
    @area_description   = area_description
  end

  def call
    error_message = []
    error_message << { message: 'Selected IDs cant be nil. Please insert atleast 3 place_ids for the best description' } if @selected_ids.blank?
    error_message << { message: "#{invalid_place_ids} does not exist" } if invalid_place_ids.present?

    if @detail_text.blank?
      error_message << { message: 'detail_text cannot be blank' }
    elsif !@detail_text.instance_of?(Array)
      error_message << { message: "Invalid detail_text format. Kindly use the following format: ['famous for nightlight', 'Great location for exploring the city']" }
    elsif @detail_text.join.chars.count > DETAIL_TEXT_CHARS_COUNT
      error_message << { message: "detail_text character size should be less than #{DETAIL_TEXT_CHARS_COUNT}" }
    end

    error_message
  end

  def invalid_place_ids
    if @selected_ids.present?
      place_ids = []
      invalid_selected_ids = []
      begin
        input_data = JSON.parse(@area_description.input_data)['search_results']
      rescue
        input_data = @area_description.input_data
      end
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
