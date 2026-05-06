class Api::ChannelsController < ApplicationController
    wrap_parameters include: Channel.attribute_names + ['serverId']
    before_action :require_logged_in
    before_action :set_server, only: [:index, :create]
    before_action :set_channel, only: [:show, :update, :destroy]
    before_action :verify_server_member, only: [:index, :show]
    before_action :verify_server_ownership, only: [:create, :update, :destroy]

    def index
        @channels = @server.channels
        render 'api/channels/index'
    end

    def show
        render 'api/channels/show'
    end

    def create
        @channel = @server.channels.new(channel_params)
        if @channel.save
            render 'api/channels/show', status: :created
        else
            render json: @channel.errors, status: :unprocessable_entity
        end
    end

    def update
        if @channel.update(channel_params.slice(:name))
            render 'api/channels/show'
        else
            render json: { errors: 'Channel update failed' }, status: :unprocessable_entity
        end
    end

    def destroy
        if Channel.where(server_id: @channel.server_id).count > 1
            @channel.destroy
            render json: { message: 'Channel successfully deleted' }
        else
            render json: { errors: 'Cannot delete the last channel' }, status: :unprocessable_entity
        end
    end

    private

    def set_server
        @server = Server.find_by(id: params[:server_id] || channel_params[:server_id])
        unless @server
            render json: { errors: 'Server not found' }, status: :not_found
        end
    end

    def set_channel
        @channel = Channel.find_by(id: params[:id])
        unless @channel
            render json: { errors: 'Channel not found' }, status: :not_found
            return
        end
        @server = @channel.server
    end

    def channel_params
        params.require(:channel).permit(:name, :server_id)
    end

    def verify_server_member
        return unless @server
        unless Membership.exists?(server_id: @server.id, user_id: current_user.id)
            render json: { errors: 'Not a member of this server' }, status: :forbidden
        end
    end

    def verify_server_ownership
        return unless @server
        unless current_user == @server.owner
            render json: { errors: 'You are not authorized to perform this action' }, status: :forbidden
        end
    end
end
