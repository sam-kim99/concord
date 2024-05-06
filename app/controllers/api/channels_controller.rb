class Api::ChannelsController < ApplicationController
    wrap_parameters include: Channel.attribute_names + ['serverId']
    before_action :set_server, only: [:create]
    before_action :set_channel, only: [:show, :update, :destroy]
    before_action :verify_server_ownership, only: [:create, :update, :destroy]

    def index
        @server = Server.find_by(id: params[:server_id])
        render 'api/channels/index'
    end

    def show
        if @channel
            render 'api/channels/show'
        else
            render json: { errors: 'Channel not found' }, status: 404
        end
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
        if @channel.update(channel_params)
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
        if @server.nil?
          render json: { errors: 'Server not found' }, status: :not_found
          return
        end
      end

    def set_channel
        @channel = Channel.find_by(id: params[:id])
        @server = @channel.server if @channel
    end

    def channel_params
        params.require(:channel).permit(:name, :server_id)
    end

    def verify_server_ownership
        unless current_user == @server.owner
            render json: { errors: 'You are not authorized to perform this action' }, status: :forbidden
        end
    end
end