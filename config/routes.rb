Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  devise_for :users
  root to: 'home#index'
  get "/terms", to: "home#terms"
  get "/privacy", to: "home#privacy"

  resources :usages, only: [:index]
  resources :task_runs, only: [:index] do
    resources :task_results, only: [:index]
  end
  resources :task_run_feedbacks, only: [:index, :create]

  resources :legacy_task_runs, only: [:index, :show, :create]
  resources :legacy_prompts, only: [:index, :new, :create]
  resources :feedbacks, only: [:create]
  resource :version, only: [:show]

  resources :listings, only: [:new, :create]
  resources :writings, only: [:new, :create]
  resources :playground_attempts, only: [:new, :create]
  resources :task_reruns, only: [:create]
  resources :prompt_sets do
    resources :prompts, only: [:new, :edit, :create, :update, :destroy]
  end

  namespace :admin do
    get 'index', to: 'home#index'
  end
end
