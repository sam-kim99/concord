class FriendshipsController < ApplicationController
    before_action :set_friendship, only: [:show, :update, :destroy]
  
    def show
        if @friendship
            render 'api/friendships/show'
        else
            render json: {errors: 'Not found'}, status: 404
        end
    end
  
    def create
      @friendship = Friendship.new(friendship_params)
  
      if @friendship.save
        render 'api/friendships/show'
      else
        render json: {errors: "Cannot be processed"}, status: 422
      end
    end
  
    def destroy
        def destroy
            friendship1 = Friendship.where(user_id: params[:user_id]).find_by(friend_id: params[:friend_id])
            friendship2 = Friendship.where(user_id: params[:friend_id]).find_by(friend_id: params[:user_id])
        
            if friendship1
                friendship1.destroy
            end
        
            if friendship2
                friendship2.destroy
            end
        
            if friendship1 || friendship2
                @friendship = friendship1 || friendship2
                render 'api/friendships/show'
            else
                render json: {errors: 'Not Found'}, status: 404
            end
        end
    end
  
    private
      def set_friendship
        @friendship = Friendship.find(params[:id])
      end
  
      def friendship_params
        params.require(:friendship).permit(:user_id, :friend_id, :status)
      end
  end
  