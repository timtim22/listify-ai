AUTH_ROUTES = ['/users', '/users/sign_in', '/api/v1/users/sign_in']
REQUEST_ROUTES = [
  '/adverts.json',
  '/area_descriptions.json',
  '/listings.json',
  '/playground_attempts.json',
  '/room_descriptions.json',
  '/search_locations.json',
  '/task_reruns.json',
  '/translations.json'
]

Rack::Attack.throttle('requests by ip', limit: 12, period: 2) do |request|
  request.ip
end

Rack::Attack.throttle('limit logins per ip', limit: 6, period: 60) do |req|
  if AUTH_ROUTES.include?(req.path) && req.post?
    req.ip
  end
end

Rack::Attack.throttle('limit requests to apis', limit: 10, period: 60) do |req|
  if REQUEST_ROUTES.include?(req.path) && req.post?
    req.ip
  end
end

Rack::Attack.throttle('limit logins per email', limit: 6, period: 60) do |req|
  if AUTH_ROUTES.include?(req.path) && req.post?
    # Normalize the email, using the same logic as your authentication process, to
    # protect against rate limit bypasses.
    req.params['email'].to_s.downcase.gsub(/\s+/, "")
  end
end
