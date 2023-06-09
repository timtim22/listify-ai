module HistoriesHelper

  REQUEST_TITLES = {
    listing_description: 'Property Description',
    listing_title: 'Property Title',
    area_description: 'Area Description',
    room_step_2: 'Rooms',
    brand_description: 'About us',
    summary_fragment: 'Listing Builder (intro)',
    other_room_fragment_step_2: 'Listing Builder (rooms)',
    bedroom_fragment_step_2: 'Listing Builder (rooms)',
    headline_fragment: 'Listing Builder (intro)', # deprecated full listing
    full_listing_room_step_2: 'Listing Builder (rooms)',
    area_description_fragment: 'Listing Builder (area)',
    oyo_one: 'Oyo (why stay here)',
    oyo_two: 'Oyo (things to do around)',
    oyo_three: 'Oyo (things to know)',
    facebook_advert: 'Facebook Ad',
    google_advert: 'Google Ad',
    google_advert_title: 'Google Ad Title'
  }

  def history_request_title(request_type)
    REQUEST_TITLES[request_type.to_sym] || request_type
  end

  def format_history_output(results)
    results.map { |r| display_history_result(r, r.translations) }.join('<br />--<br /><br />').html_safe
  end

  def display_history_input(task_run, task_runs)
    input_object = history_input_object(task_run, task_runs)
    if input_object.respond_to?(:input_language) && input_object.input_language != "EN"
      input_object.untranslated_input_text
    elsif input_object.respond_to?(:displayable_input_text)
      input_object.displayable_input_text
    else
      input_object.input_text
    end
  end

  def history_input_object(task_run, upstream_task_runs)
    if task_run.upstream_task_run_id
      original = upstream_task_runs.find { |t| t.id == task_run.upstream_task_run_id }
      original.input_object
    else
      task_run.input_object
    end
  end

  def display_history_result(result, translations = nil)
    if result.success && result.safe?
      result_text = history_text_with_translation(result, translations)
      display_text = simple_format(result_text)
      "<div>#{display_text}</div>"
    else
      "<div>This result isn't available - either something went wrong during the request, or the result was flagged as unsafe.</div>"
    end
  end

  def history_text_with_translation(result, translations)
    if translations.any?
      tr_strings = translations.map do |translation|
        "#{translation.to}: #{translation.result_text} \n"
      end
      "#{tr_strings.join('')} EN: #{result.result_text}"
    else
      result.result_text
    end
  end
end
