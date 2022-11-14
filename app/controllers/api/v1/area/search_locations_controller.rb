class Api::V1::Area::SearchLocationsController < Api::V1::ApiController
  before_action :validate_params

  def create
    search_text = params[:search_text].downcase
    @search_location = SearchLocation.find_or_create_with(search_text)
    record_search_by_user

    return location_not_found_message if @search_location.latitude.nil?

    @attractions = AreaSearch::AttractionFinder.new(
      @search_location,
      params[:search_radius].to_i * 1000
    ).find!

    @search_location.search_results.create(results: @attractions)
    success_response
  end

  private

  def validate_params
    errors = ApiValidators::SearchLocation.new(params, current_user).call
    json_bad_request(errors) if errors.any?
  end

  def location_not_found_message
    json_not_found("Sorry, our search provider couldn't identify that place. You could try a different search term, e.g, 'Waterloo, London' instead of 'Waterloo'.")
  end

  def success_response
    json_success(
      'Successfully Generated Results',
      {
        search_location_id: @search_location.id,
        search_results: necessary_result_keys(@attractions),
        task_run_id: @task_run_id
      }
    )
  end

  def necessary_result_keys(attraction_object)
    necessary_keys = %i[name categories total_ratings place_id]
    attraction_object.transform_values do |attraction_array|
      attraction_array.map do |attraction|
        attraction.select { |k, _v| necessary_keys.include? k }
      end
    end
  end

  def record_search_by_user
    @search_location.recorded_searches.create!(
      user: current_user,
      attraction_radius: params[:attraction_radius] * 1000
    )
    recorded_search_volume = RecordedSearch.where('created_at > ?', Time.zone.today.beginning_of_day).count
    raise 'Unexpected search volume recorded!' if recorded_search_volume > 200

    return unless recorded_search_volume == 150

    AdminMailer.unexpected_search_volume.deliver_later
  end
end
