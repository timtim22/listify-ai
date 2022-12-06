Rails.application.routes.draw do
  mount Rswag::Ui::Engine => '/api-docs'
  mount Rswag::Api::Engine => '/api-docs'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  mount StripeEvent::Engine, at: '/webhooks/stripe'

  devise_for :users,
             controllers: {
                 sessions: 'users/sessions',
                 registrations: 'users/registrations'
             }

  devise_scope :user do
    scope :users, as: :users do
      post 'pre_otp', to: 'users/sessions#pre_otp'
    end
  end

  namespace :api do
    namespace :v1 do
      namespace :users do
        post '/sign_in', to: 'authentication#login'
      end
      namespace :listings do
        resource :descriptions, only: [:create]
        resource :titles, only: [:create]
      end
      resource :task_runs, only: [:show]
      namespace :area do
        resource :search_locations, only: [:create]
        resource :descriptions, only: [:create]
      end
    end
  end

  resources :users, only: [] do
    scope module: :users do
      resource :custom_trial_end_dates, only: [:edit, :update]
    end
  end

  resource :two_factor, only: [:create, :destroy]

  root to: 'listings#new'
  get '/terms', to: 'home#terms'
  get '/privacy', to: 'home#privacy'

  get '/listing_builder_task_results', to: 'listing_fragments#task_results'
  post '/social_listings', to: 'adverts#create'

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
    resources :oyo, only: [:create]
    resources :sykes, only: [:create]
    resources :vacasa, only: [:create]
    resources :generic_inputs, only: [:create]
  end

  resource :usage, only: [:show]
  resource :account, only: [:edit, :update]
  resources :teams, only: [:show] do
    resources :team_invitations, only: [:new, :create, :destroy] do
      member do
        post 'resend'
      end
    end
  end
  resource :history, only: [:show]
  resources :team_roles, only: [:destroy]

  namespace :text do
    resources :shortcuts, only: [:index, :create, :update, :destroy]
  end

  resource :customer, only: [:edit, :update]
  resource :card
  resource :pricing, controller: :pricing
  resource :subscription do
    patch :resume
  end
  resources :payments
  resources :charges

  namespace :admin do
    get 'index', to: 'home#index'
    patch 'tag_batch', to: 'examples#tag_batch'

    resources :admins, only: [:index]
    resources :data_exports, only: [:index]
    resources :examples
    resources :procedures do
      resources :registered_steps, only: [:index, :show]
      resources :steps, :controller => "step_prompts"
    end
    resources :playground_forms, only: [:new]
    resources :recorded_completions, only: [:index, :show] do
      get 'search', on: :collection
    end
    resources :subscriptions, only: [:index]
    namespace :taggers do
      resources :rules
    end

    resources :shortcuts, only: [:index]
    resources :teams, only: [:index]
    resources :trials, only: [:index]
    resources :user_locks, only: [:create, :destroy]
  end
end
 
