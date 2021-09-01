Rails.application.routes.draw do
  devise_for :users
  root to: 'home#index'
  get '/listings', to: 'home#listings'

  resources :task_runs, only: [:index, :show, :create]
  resources :prompts, only: [:index, :new, :create]
  resources :feedbacks, only: [:create]
  resource :version, only: [:show]
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
