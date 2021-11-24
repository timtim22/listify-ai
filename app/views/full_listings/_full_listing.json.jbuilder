json.full_listing do
  json.id @full_listing.id
  json.requests_completed @full_listing.requests_completed
  json.text @full_listing.result_text
end
