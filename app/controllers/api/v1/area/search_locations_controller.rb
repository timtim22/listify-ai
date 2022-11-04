class Api::V1::Area::SearchLocationsController < Api::V1::ApiController
  before_action :admin_user
  before_action :validate_params

  def create
    search_text = params[:search_text].downcase
    @search_location = SearchLocation.find_or_create_with(search_text)
    record_search_by_user

    return location_not_found_message if @search_location.latitude.nil?

    @attractions = AreaSearch::AttractionFinder.new(
      @search_location,
      params[:search_radius] * 1000
    ).find!

    @search_location.search_results.create(results: @attractions)
    success_response
  end

  private

  def admin_user
    json_unauthorized('You are not authorized to access this endpoint. Only admin can access this endpoint.') unless current_user.admin
  end

  def validate_params
    errors = ApiValidators::SearchLocation.new(params).call
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
        search_results: @attractions,
        task_run_id: @task_run_id
      }
    )
  end

  def record_search_by_user
    @search_location.recorded_searches.create!(user: current_user)
    recorded_search_volume = RecordedSearch.where('created_at > ?', Time.zone.today.beginning_of_day).count
    raise 'Unexpected search volume recorded!' if recorded_search_volume > 200

    return unless recorded_search_volume == 150

    AdminMailer.unexpected_search_volume.deliver_later
  end
end
