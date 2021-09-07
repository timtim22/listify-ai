Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  devise_for :users
  root to: 'home#index'

  resources :task_runs, only: [:index] do
    resources :task_run_feedbacks, only: [:create, :index]
  end
  resources :legacy_task_runs, only: [:index, :show, :create]
  resources :legacy_prompts, only: [:index, :new, :create]
  resources :feedbacks, only: [:create]
  resource :version, only: [:show]

  resources :listings, only: [:show, :new, :create]
  resources :prompt_sets do
    resources :prompts, only: [:new, :edit, :create, :update, :destroy]
  end
end
