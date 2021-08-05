Rails.application.routes.draw do
  devise_for :users
  root to: 'home#index'

  resources :task_runs, only: [:index, :show, :create]
  resources :prompts, only: [:index]
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
