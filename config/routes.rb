Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  mount StripeEvent::Engine, at: '/webhooks/stripe'

  devise_for :users, controllers: { registrations: "registrations" }

  root to: 'home#index'
  get '/terms', to: 'home#terms'
  get '/privacy', to: 'home#privacy'

  resources :task_runs, only: [:index] do
    resources :task_results, only: [:index]
  end
  resources :task_run_feedbacks, only: [:index, :create]

  resources :full_listings, only: [:create, :show]

  resources :listings, only: [:new, :create]
  resources :room_descriptions, only: [:create]
  resources :area_descriptions, only: [:create]
  resources :search_locations, only: [:create]
  resources :recorded_searches, only: [:index]
  resources :translations, only: [:create]
  resources :writings, only: [:new, :create]
  resources :playground_attempts, only: [:new, :create]
  resources :task_reruns, only: [:create]
  resources :copy_events, only: [:create]
  resources :prompt_sets do
    resources :prompts, only: [:new, :edit, :create, :update, :destroy]
  end

  resource :usage, only: [:show]

  resource :card
  resource :pricing, controller: :pricing
  resource :subscription do
    patch :resume
  end
  resources :payments
  resources :charges

  namespace :admin do
    get 'index', to: 'home#index'
    resources :statistics, only: [:index]
    resources :user_locks, only: [:create, :destroy]
  end

  namespace :legacy do
    resources :task_runs, only: [:index]
    resources :prompts, only: [:index]
  end
end
