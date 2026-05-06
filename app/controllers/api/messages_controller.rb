class Api::MessagesController < ApplicationController
    wrap_parameters include: Message.attribute_names
    before_action :require_logged_in
    before_action :set_channel_for_index, only: [:index]
    before_action :set_channel_for_create, only: [:create]
    before_action :set_message, only: [:show, :update, :destroy]
    before_action :verify_channel_member, only: [:index, :show, :create, :update, :destroy]

    def index
        @messages = @channel.messages.includes(:user)
        render 'api/messages/index'
    end

    def show
        render 'api/messages/show'
    end

    def create
        @message = @channel.messages.new(message_params.slice(:content))
        @message.user_id = current_user.id
        if @message.save
            broadcast_upsert(@message)
            render 'api/messages/show'
        else
            render json: { errors: @message.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def update
        unless @message.user_id == current_user.id
            render json: { errors: 'Not authorized' }, status: 403
            return
        end

        if @message.update(message_params.slice(:content))
            broadcast_upsert(@message)
            render 'api/messages/show'
        else
            render json: { errors: @message.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def destroy
        unless @message.user_id == current_user.id
            render json: { errors: 'Not authorized' }, status: 403
            return
        end

        channel = @message.channel
        message_id = @message.id
        @message.destroy
        ChannelsChannel.broadcast_to(channel, { removed: { id: message_id, channelId: channel.id } })
        head :no_content
    end

    private

    def set_channel_for_index
        @channel = Channel.find_by(id: params[:channel_id])
        unless @channel
            render json: { errors: 'Channel not found' }, status: 404
        end
    end

    def set_channel_for_create
        @channel = Channel.find_by(id: message_params[:channel_id])
        unless @channel
            render json: { errors: 'Channel not found' }, status: 404
        end
    end

    def set_message
        @message = Message.find_by(id: params[:id])
        unless @message
            render json: { errors: 'Message not found' }, status: 404
            return
        end
        @channel = @message.channel
    end

    def message_params
        params.require(:message).permit(:content, :user_id, :channel_id)
    end

    def verify_channel_member
        return unless @channel
        unless Membership.exists?(server_id: @channel.server_id, user_id: current_user.id)
            render json: { errors: 'Not a member of this server' }, status: :forbidden
        end
    end

    def broadcast_upsert(message)
        ChannelsChannel.broadcast_to(message.channel, {
            message: {
                id: message.id,
                content: message.content,
                channelId: message.channel_id,
                userId: message.user_id,
                createdAt: message.created_at,
                time: message.created_at.to_time.localtime.strftime('%l:%M %p'),
                author: message.user.username
            }
        })
    end
end
