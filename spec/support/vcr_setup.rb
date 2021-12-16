VCR.configure do |c|
  c.cassette_library_dir = 'spec/vcr_cassettes'
  c.hook_into :webmock
  c.configure_rspec_metadata!
  c.allow_http_connections_when_no_cassette = true

  Rails.application.credentials.stripe.each do |k,v|
    c.filter_sensitive_data('< PRIVATE KEY >') { v }
  end
end
