# frozen_string_literal: true

require 'sidekiq/web'
require 'sidekiq-scheduler/web'

Sidekiq::Web.set :session_secret, Rails.application.secrets[:secret_key_base]

Rails.application.routes.draw do
  mount LetterOpenerWeb::Engine, at: 'letter_opener' if Rails.env.development?

  authenticate :user, lambda { |u| u.admin? } do
    mount Sidekiq::Web, at: 'sidekiq', as: :sidekiq
    mount PgHero::Engine, at: 'pghero', as: :pghero
  end

  use_doorkeeper do
    controllers authorizations: 'oauth/authorizations',
                authorized_applications: 'oauth/authorized_applications',
                tokens: 'oauth/tokens'
  end

  get '.well-known/host-meta', to: 'well_known/host_meta#show', as: :host_meta, defaults: { format: 'xml' }
  get '.well-known/webfinger', to: 'well_known/webfinger#show', as: :webfinger
  get 'manifest', to: 'manifests#show', defaults: { format: 'json' }
  get 'intent', to: 'intents#show'

  devise_scope :user do
    get '/invite/:invite_code', to: 'auth/registrations#new', as: :public_invite
    match '/auth/finish_signup' => 'auth/confirmations#finish_signup', via: [:get, :patch], as: :finish_signup
  end

  devise_for :users, path: 'auth', controllers: {
    omniauth_callbacks: 'pawoo/auth/omniauth_callbacks',
    sessions:           'auth/sessions',
    registrations:      'auth/registrations',
    passwords:          'auth/passwords',
    confirmations:      'auth/confirmations',
  }

  devise_scope :user do
    with_devise_exclusive_scope('/auth', :user, {}) do
      resource :oauth_registration, only: [:new, :create],
        controller: 'pawoo/oauth_registrations',
        path: 'oauth/oauth_registrations'
    end
  end

  get '/users/:username', to: redirect('/@%{username}'), constraints: lambda { |req| req.format.nil? || req.format.html? }

  resources :accounts, path: 'users', only: [:show], param: :username do
    resources :stream_entries, path: 'updates', only: [:show] do
      member do
        get :embed
      end
    end

    get :remote_follow,  to: 'remote_follow#new'
    post :remote_follow, to: 'remote_follow#create'

    resources :statuses, only: [:show] do
      member do
        get :activity
        get :embed
      end
    end

    get :media, to: redirect(path: '/@%{account_username}/media')
    resources :followers, only: [:index], controller: :follower_accounts
    resources :following, only: [:index], controller: :following_accounts
    resource :follow, only: [:create], controller: :account_follow
    resource :unfollow, only: [:create], controller: :account_unfollow

    resource :outbox, only: [:show], module: :activitypub
    resource :inbox, only: [:create], module: :activitypub
    resources :collections, only: [:show], module: :activitypub
  end

  resource :inbox, only: [:create], module: :activitypub

  get '/@:username', to: 'accounts#show', as: :short_account
  get '/@:username/with_replies', to: 'accounts#show', as: :short_account_with_replies
  get '/@:username/media', to: 'accounts#show', as: :short_account_media
  get '/@:account_username/:id', to: 'statuses#show', as: :short_account_status
  get '/@:account_username/:id/embed', to: 'statuses#embed', as: :embed_short_account_status

  namespace :settings do
    resource :profile, only: [:show, :update]
    resource :preferences, only: [:show, :update]
    resource :notifications, only: [:show, :update]
    resource :import, only: [:show, :create]

    resource :export, only: [:show, :create]
    namespace :exports, constraints: { format: :csv } do
      resources :follows, only: :index, controller: :following_accounts
      resources :blocks, only: :index, controller: :blocked_accounts
      resources :mutes, only: :index, controller: :muted_accounts
    end

    resource :two_factor_authentication, only: [:show, :create, :destroy]
    namespace :two_factor_authentication do
      resources :recovery_codes, only: [:create]
      resource :confirmation, only: [:new, :create]
    end

    resource :follower_domains, only: [:show, :update]

    resources :applications, except: [:edit] do
      member do
        post :regenerate
      end
    end

    resource :delete, only: [:show, :destroy]
    resource :migration, only: [:show, :update]

    resources :sessions, only: [:destroy]
  end

  resources :media, only: [:show] do
    get :player
  end

  resources :tags,   only: [:show]
  resources :emojis, only: [:show]
  resources :invites, only: [:index, :create, :destroy]

  get '/intent/statuses/new', to: redirect(path: '/share')

  get '/media_proxy/:id/(*any)', to: 'media_proxy#show', as: :media_proxy

  # Remote follow
  resource :remote_unfollow, only: [:create]
  resource :authorize_follow, only: [:show, :create]
  resource :share, only: [:show, :create]

  namespace :admin do
    resources :subscriptions, only: [:index]
    resources :domain_blocks, only: [:index, :new, :create, :show, :destroy]
    resources :email_domain_blocks, only: [:index, :new, :create, :destroy]
    resources :action_logs, only: [:index]
    resource :settings, only: [:edit, :update]
    resources :invites, only: [:index, :create, :destroy]

    resources :instances, only: [:index] do
      collection do
        post :resubscribe
      end
    end

    resources :reports, only: [:index, :show, :update] do
      resources :reported_statuses, only: [:create]
    end

    resources :report_notes, only: [:create, :destroy]

    resources :accounts, only: [:index, :show] do
      member do
        post :subscribe
        post :unsubscribe
        post :enable
        post :disable
        post :redownload
        post :remove_avatar
        post :memorialize
      end

      resource :change_email, only: [:show, :update]
      resource :reset, only: [:create]
      resource :silence, only: [:create, :destroy]
      resource :suspension, only: [:create, :destroy]
      resources :statuses, only: [:index, :create, :update, :destroy]

      resource :confirmation, only: [:create] do
        collection do
          post :resend
        end
      end

      resource :role do
        member do
          post :promote
          post :demote
        end
      end
    end

    resources :users, only: [] do
      resource :two_factor_authentication, only: [:destroy]
    end

    resources :custom_emojis, only: [:index, :new, :create, :update, :destroy] do
      member do
        post :copy
        post :enable
        post :disable
      end
    end

    resources :account_moderation_notes, only: [:create, :destroy]
  end

  authenticate :user, lambda { |u| u.admin? } do
    get '/admin', to: redirect('/admin/settings/edit', status: 302)
  end

  authenticate :user, lambda { |u| u.moderator? } do
    get '/admin', to: redirect('/admin/reports', status: 302)
  end

  namespace :api do
    # PubSubHubbub outgoing subscriptions
    resources :subscriptions, only: [:show]
    post '/subscriptions/:id', to: 'subscriptions#update'

    # PubSubHubbub incoming subscriptions
    post '/push', to: 'push#update', as: :push

    # Salmon
    post '/salmon/:id', to: 'salmon#update', as: :salmon

    # OEmbed
    get '/oembed', to: 'oembed#show', as: :oembed

    # JSON / REST API
    namespace :v1 do
      resources :statuses, only: [:create, :show, :destroy] do
        scope module: :statuses do
          resources :reblogged_by, controller: :reblogged_by_accounts, only: :index
          resources :favourited_by, controller: :favourited_by_accounts, only: :index
          resource :reblog, only: :create
          post :unreblog, to: 'reblogs#destroy'

          resource :favourite, only: :create
          post :unfavourite, to: 'favourites#destroy'

          resource :mute, only: :create
          post :unmute, to: 'mutes#destroy'

          resource :pin, only: [:create, :destroy]
          post :unpin, to: 'pins#destroy'
        end

        member do
          get :context
          get :card
        end
      end

      namespace :timelines do
        resource :direct, only: :show, controller: :direct
        resource :home, only: :show, controller: :home
        resource :public, only: :show, controller: :public
        resources :tag, only: :show
        resources :list, only: :show
      end

      resources :streaming, only: [:index]
      resources :custom_emojis, only: [:index]

      get '/search', to: 'search#index', as: :search
      get '/search/statuses/:query', to: 'search#statuses', as: :status_search_timeline

      resources :follows,    only: [:create]
      resources :media,      only: [:create, :update]
      resources :blocks,     only: [:index]
      resources :mutes,      only: [:index]
      resources :favourites, only: [:index]
      resources :reports,    only: [:index, :create]

      namespace :apps do
        get :verify_credentials, to: 'credentials#show'
      end

      resources :apps, only: [:create]

      resource :instance, only: [:show] do
        resources :peers, only: [:index], controller: 'instances/peers'
        resource :activity, only: [:show], controller: 'instances/activity'
      end

      resource :domain_blocks, only: [:show, :create, :destroy]

      resources :follow_requests, only: [:index] do
        member do
          post :authorize
          post :reject
        end
      end

      resources :notifications, only: [:index, :show] do
        collection do
          post :clear
          post :dismiss
        end
      end

      namespace :accounts do
        get :verify_credentials, to: 'credentials#show'
        patch :update_credentials, to: 'credentials#update'
        resource :search, only: :show, controller: :search
        resources :relationships, only: :index
      end

      resources :accounts, only: [:show] do
        resources :statuses, only: :index, controller: 'accounts/statuses'
        resources :followers, only: :index, controller: 'accounts/follower_accounts'
        resources :following, only: :index, controller: 'accounts/following_accounts'
        resources :lists, only: :index, controller: 'accounts/lists'
        resources :pinned_statuses, only: :index, controller: '/pawoo/api/v1/accounts/pinned_statuses'

        member do
          post :follow
          post :unfollow
          post :block
          post :unblock
          post :mute
          post :unmute
        end
      end

      resources :lists, only: [:index, :create, :show, :update, :destroy] do
        resource :accounts, only: [:show, :create, :destroy], controller: 'lists/accounts'
      end

      namespace :push do
        resource :subscription, only: [:create, :show, :update, :destroy]
      end
    end

    namespace :web do
      resource :settings, only: [:update]
      resource :embed, only: [:create]
      resources :push_subscriptions, only: [:create] do
        member do
          put :update
        end
      end
    end
  end

  get '/web/(*any)', to: 'home#index', as: :web

  get '/about',      to: 'about#show'
  get '/about/more', to: 'about#more'
  get '/terms',      to: 'about#terms'
  get '/app_terms',  to: 'about#app_terms'
  get '/app_eula',   to: 'about#app_eula'

  root 'home#index'

  scope module: :pawoo do
    namespace :settings do
      resources :oauth_authentications, only: [:index, :destroy]
    end

    resources :oauth_authentications, only: [:show], param: :uid

    namespace :admin do
      resources :suggestion_tags, only: [:index, :new, :create, :edit, :update, :destroy]
      resources :trend_ng_words, only: [:index, :new, :create, :edit, :update, :destroy]
      resources :oauth_authentications, only: [:destroy]

      scope :pawoo, as: :pawoo do
        resources :report_targets, only: [:index, :create]
        resources :report_summations, only: [:index]
        resources :galleries, only: [:index, :new, :create, :show, :edit, :update, :destroy] do
          resources :blacklist, only: :destroy, controller: :gallery_blacklisted_statuses
        end
      end
    end

    namespace :api do
      namespace :v1 do
        resource :push_notification_preferences, only: [:show, :update]
        resources :trend_tags, only: [:index]
        resources :suggestion_tags, only: [:index]
        resources :pixiv_twitter_images, only: [:create]
        resources :firebase_cloud_messaging_tokens, only: [:create, :destroy], param: :platform
        resources :suggested_accounts, only: [:index]
        resources :oauth_authentications, only: [:show], param: :uid

        scope :pawoo, as: :pawoo do
          resource :expo_push_tokens, only: [:create, :destroy]
          resources :followers_you_follow, only: [:show], param: :account_id
          resources :galleries, only: [:show], param: :tag do
            resources :blacklist, only: :update, controller: :gallery_blacklisted_statuses
          end
        end
      end
    end

    namespace :sitemap do
      resources :user_indexes, only: [:index, :show], param: :page, format: :xml
      resources :status_indexes, only: [:index, :show], param: :page, format: :xml
    end

    scope :pawoo, as: :pawoo do
      resources :galleries, only: [:index, :show], param: :tag
    end
  end


  match '*unmatched_route',
        via: :all,
        to: 'application#raise_not_found',
        format: false
end
