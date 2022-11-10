module ApiClients
  class Mock

    def run_request!(task_run)
      successful_response(task_run)
    end

    def successful_response(task_run)
      {
        service: Completion::Services::MOCK,
        success: true,
        result_text: result_text(task_run),
        should_check_content: false
      }
    end

    def result_text(task_run)
      case task_run.input_object.request_type
      when 'listing_title'
        listing_title
      when 'listing_description'
        listing_description
      when 'area_description'
        area_description
      else
        'Successful response from ApiClients::Mock'
      end
    end

    def listing_title
      ["2 bedroom apartment with sea views and heated pool in Malaga", "Luxurious 2 Bedroom Apartment with Stunning Sea Views and Heated Pool", "Perfect for couples - sea views - heated swimming pool", "2 bedroom apartment with sea views close to shops and restaurants"].join('." ')
    end

    def listing_description
      [
        "The perfect spot for a romantic getaway, this 2 bedroom apartment in Malaga offers couples stunning sea views from the large balcony and all the amenities they need for a comfortable stay, including a heated swimming pool. The open plan living space is perfect for socialising, and the apartment is close to shops and restaurants, making it easy to get around. What's more, it's just a short drive from the airport.",
        "This two bedroom apartment in Malaga is the perfect place for couples to enjoy a relaxing holiday. The apartment has a heated swimming pool, and a large balcony with sea views. The property is close to shops and restaurants, and a short drive to the airport.",
        "This two bedroom apartment in Malaga is ideal for couples and has sea views from the balcony. The apartment has an open plan living space and a heated swimming pool, perfect for lazy days. It's also close to shops and restaurants, and is just a short drive to the airport.",
        "This is an ideal apartment for couples looking for a romantic vacation in Malaga. The apartment enjoys stunning sea views, is beautifully furnished and is close to shops and restaurants. It also has a large balcony and a heated swimming pool.",
        "Enjoy a romantic break in Malaga from this two-bedroom apartment with sea views! The apartment has a large balcony and an open plan living space, with a heated swimming pool for you to enjoy together. It is ideal for couples and is just a short drive to the airport."
      ].join('." ')
    end

    def area_description
      "If you're looking for a neighbourhood that's brimming with history and culture, then look no further than London! Home to some of the world's most iconic landmarks including Big Ben, The National Gallery and Westminster Abbey, there's something for everyone to enjoy in this vibrant city. And when the sun goes down, the fun doesn't stop – London comes alive at night, so be sure to check out the city's many bars and restaurants for a truly unforgettable evening."
    end
  end
end
