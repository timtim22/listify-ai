module ApiValidators
  class AreaDescription
    DETAIL_TEXT_CHARS_COUNT = 100

    attr_reader :current_user, :selected_ids, :detail_text, :search_location_id, :errors

    def initialize(params, current_user)
      @current_user       = current_user
      @selected_ids       = params['selected_ids']
      @detail_text        = params['detail_text']
      @search_location_id = params['search_location_id']
      @errors             = []
    end

    def call
      validate_selected_ids
      validate_search_location
      validate_detail_text
      validate_spins_remaining
      errors
    end

    def validate_selected_ids
      return unless selected_ids.blank?
      errors << { message: 'Selected IDs cannot be nil. Please select at least 3 place_ids for the best description' }
    end

    def validate_search_location
      return unless search_location_id.blank? || ::SearchLocation.find_by(id: search_location_id).nil?
      errors << { message: 'search_location does not exist' }
    end

    def validate_detail_text
      if detail_text.blank?
        errors << { message: 'detail_text cannot be blank' }
      elsif !detail_text.instance_of?(Array)
        errors << { message: "Invalid detail_text format. Kindly use the following format: ['famous for nightlife', 'Great location for exploring the city']" }
      elsif detail_text.join.chars.count > DETAIL_TEXT_CHARS_COUNT
        errors << { message: "detail_text character size should be less than #{DETAIL_TEXT_CHARS_COUNT}" }
      end
    end

    def validate_spins_remaining
      return unless current_user.runs_remaining_today <= 0
      errors << { message: 'No Spins remaining on your account. Please upgrade or contact us for assistance.' }
    end
  end
end
