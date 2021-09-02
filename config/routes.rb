Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  devise_for :users
  root to: 'home#index'
  get '/listings', to: 'home#listings'

  resources :legacy_task_runs, only: [:index, :show, :create]
  resources :legacy_prompts, only: [:index, :new, :create]
  resources :feedbacks, only: [:create]
  resource :version, only: [:show]

  resources :listings, only: [:show, :new, :create]
end
