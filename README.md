# README

## Setup

To get started, `git clone` the repo. Then

```
bundle install
yarn install # I think!
```

We use a rails credentials file for app secrets, I can share this with you on a call. The app might not start without it.


## Running the app

To use the app in development you will need to run `rails s` in one terminal window, and `./bin/webpack-dev-server` in another. This automatically reloads the page every time the css or javascript changes, and is much quicker when you are developing.

To generate results quickly, we spin up multiple web workers to process API requests. This means that to get results you need redis running (`redis-server`) and sidekiq (`bundle exec sidekiq`).

If four terminal windows is a pain let me know and I can look at bundling processes together using the Foreman gem or something like that.

## High level notes

The app uses Rails with React components for screens that require Javascript. Styling is done with Tailwind CSS (and a handful of custom styles in app/javascript/stylesheets/application.scss).

You can figure out where the code is for a page by looking at the url, finding the rails controller for it, and then looking in the app/views folder. If the page uses Javascript at all the view will hand off to a React component, which you can find in app/javascript. The code for the generators all starts at the listings#new endpoint, and the Listings/New.js component is where you'll want to start to understand the bulk of the front end.

Calls to GPT and Google should be stubbed in development mode by default, though I haven't refactored this into a neat mechanism.

