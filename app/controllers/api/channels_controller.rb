class Api::ChannelsController < ApplicationController
    wrap_parameters include: Channel.attribute_names + ['serverId']
    before_action :set_channel, only: [:show, :update, :destroy]

    def index
        server_id = params[:server_id]
        @server = Server.find_by(id: server_id)
        'api/channels/index'
    end

    def show
        if @channel
            render 'api/channels/show'
        else
            render json: {errors: 'Channel not found'}, status: 404
        end
    end


    def create
        @channel = Channel.new(channel_params)

        if @channel.save!
            render 'api/channels/show'
        else
            render json: @channel.errors, status: :unprocessable_entity
        end
    end

    def update
        if @channel.update(channel_params)
            render 'api/channels/show'
        else
            render json: {errors: 'Channel not found'}, status: 404
        end
    end

    def destroy
        if @channel.nil?
            render json: { errors: 'Channel Not Found' }, status: 404
        elsif Channel.where(server_id: @channel.server_id).count > 1
            @channel.destroy
            render json: { message: 'Channel successfully deleted' }
        else
            render json: { errors: 'Cannot delete last channel' }, status: :unprocessable_entity
        end
    end

    private

    def set_channel
        @channel = Channel.find(params[:id])
    end

    def channel_params
        params.require(:channel).permit(:name, :server_id)
    end
end
