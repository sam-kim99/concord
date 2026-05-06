class Api::FriendshipsController < ApplicationController
  before_action :require_logged_in
  before_action :set_friendship, only: [:show, :update, :destroy]

  def index
    @friendships = Friendship
      .where('user_id = :id OR friend_id = :id', id: current_user.id)
      .includes(:user, :friend)
    render 'api/friendships/index'
  end

  def show
    unless [@friendship.user_id, @friendship.friend_id].include?(current_user.id)
      render json: { errors: 'Not authorized' }, status: 403
      return
    end
    render 'api/friendships/show'
  end

  def create
    @friendship = Friendship.new(friendship_params)
    @friendship.user_id ||= current_user.id

    unless @friendship.user_id == current_user.id
      render json: { errors: 'Cannot create a friendship for another user' }, status: 403
      return
    end

    if @friendship.save
      render 'api/friendships/show'
    else
      render json: { errors: @friendship.errors.full_messages }, status: 422
    end
  end

  def update
    unless @friendship.friend_id == current_user.id
      render json: { errors: 'Only the recipient can respond to this request' }, status: 403
      return
    end

    if @friendship.update(status: params.dig(:friendship, :status) || params[:status])
      if @friendship.status == 'accepted'
        Friendship.find_or_create_by(
          user_id: @friendship.friend_id,
          friend_id: @friendship.user_id
        ) { |f| f.status = 'accepted' }
      end
      render 'api/friendships/show'
    else
      render json: { errors: @friendship.errors.full_messages }, status: 422
    end
  end

  def destroy
    unless [@friendship.user_id, @friendship.friend_id].include?(current_user.id)
      render json: { errors: 'Not authorized' }, status: 403
      return
    end

    reverse = Friendship.find_by(
      user_id: @friendship.friend_id,
      friend_id: @friendship.user_id
    )

    @friendship.destroy
    reverse&.destroy

    render 'api/friendships/show'
  end

  private

  def set_friendship
    @friendship = Friendship.find_by(id: params[:id])
    render(json: { errors: 'Not found' }, status: 404) and return unless @friendship
  end

  def friendship_params
    params.require(:friendship).permit(:user_id, :friend_id, :status)
  end
end
