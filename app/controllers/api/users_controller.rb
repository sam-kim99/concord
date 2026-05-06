class Api::UsersController < ApplicationController
    wrap_parameters include: User.attribute_names + ['password']
    before_action :require_logged_out, only: [:create]
    before_action :require_logged_in, only: [:show, :index]

    def index
        query = params[:q].to_s.strip
        @users = if query.empty?
                     User.none
                 else
                     User.where('LOWER(username) LIKE ?', "%#{query.downcase}%").limit(20)
                 end
        render 'api/users/index'
    end

    def show
        @user = User.includes(:owned_servers).find(params[:id])
        if @user
          render 'api/users/show'
        else
          render json: { errors: 'User not found' }, status: 404
        end
    end

    def create
        @user = User.new(user_params)
        if @user.save
            login(@user)
            render 'api/users/show'
        else
            render json: @user.errors, status: 422
        end
    end

    private
    def user_params
        params.require(:user).permit(:username, :email, :password)
    end

end
