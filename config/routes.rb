Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  # get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  # mount ActionCable.server => '/cable'

  namespace :api, defaults: { format: :json } do
    resources :users, only: [:show, :create]
    resource :session, only: [:show, :create, :destroy]
    resources :servers do 
      resources :channels
      resources :memberships
    end

    resources :channels, except: [:index] do
      resources :messages, only: [:index]
    end

    resources :messages, except: [:index]
    resources :memberships, only: [:create, :destroy]
    resources :friendships, only: [:create, :destroy, :update]
  end
end
