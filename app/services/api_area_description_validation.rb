class ApiAreaDescriptionValidation
  DETAIL_TEXT_CHARS_COUNT = 100

  def initialize(params)
    @params             = params
    @selected_ids       = @params['selected_ids']
    @detail_text        = @params['detail_text']
    @search_location_id = @params['search_location_id']
  end

  def call
    error_message = []
    error_message << { message: 'Selected IDs cant be nil. Please insert atleast 3 place_ids for the best description' } if @selected_ids.blank?
    error_message << { message: 'search_location does not exist' } if @search_location_id.blank? || SearchLocation.find_by(id: @search_location_id).nil?

    if @detail_text.blank?
      error_message << { message: 'detail_text cannot be blank' }
    elsif !@detail_text.instance_of?(Array)
      error_message << { message: "Invalid detail_text format. Kindly use the following format: ['famous for nightlight', 'Great location for exploring the city']" }
    elsif @detail_text.join.chars.count > DETAIL_TEXT_CHARS_COUNT
      error_message << { message: "detail_text character size should be less than #{DETAIL_TEXT_CHARS_COUNT}" }
    end

    error_message
  end
end
