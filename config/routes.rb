Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  mount StripeEvent::Engine, at: '/webhooks/stripe'

  devise_for :users, controllers: { registrations: 'registrations' }

  root to: 'listings#new'
  get '/terms', to: 'home#terms'
  get '/privacy', to: 'home#privacy'

  get '/listing_builder_task_results', to: 'listing_fragments#task_results'

  resources :task_runs, only: [:index] do
    resources :task_results, only: [:index]
  end

  resources :listings, only: [:new, :create]
  resources :listing_fragments, only: [:create]
  resources :room_descriptions, only: [:create]
  resources :area_descriptions, only: [:create]
  resources :brand_descriptions, only: [:create]
  resources :adverts, only: [:create]
  resources :search_locations, only: [:create]
  resources :recorded_searches, only: [:index]
  resources :translations, only: [:create] do
    post :create_batch, on: :collection
  end
  resources :playground_attempts, only: [:new, :create]
  resources :task_reruns, only: [:create]
  resources :copy_events, only: [:create]
  resources :prompt_sets do
    resources :prompts, only: [:new, :edit, :create, :update, :destroy]
  end

  namespace :custom_inputs do
    resources :oyo_one, only: [:create]
  end

  resource :usage, only: [:show]
  resource :account, only: [:edit, :update]
  resources :teams, only: [:show]
  resource :history, only: [:show]

  resource :card
  resource :pricing, controller: :pricing
  resource :subscription do
    patch :resume
  end
  resources :payments
  resources :charges

  namespace :admin do
    get 'index', to: 'home#index'
    resources :examples
    resources :recorded_completions, only: [:index, :show]
    resources :statistics, only: [:index]
    resources :user_locks, only: [:create, :destroy]
    resources :data_exports, only: [:index]
  end
end
