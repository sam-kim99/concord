class Api::MessagesController < ApplicationController
    wrap_parameters include: Message.attribute_names
    before_action :set_message, only: [:show, :update, :destroy]

    def show
        if @message
            render 'api/messages/show'
        else
            render json: {error: 'Message not found'}, status: 404
        end
    end

    def create
        if @message.save
            render 'api/messages/show'
        else
            render json:  @message.errors, status: :unprocessable_entity
        end
    end

    def update
        if @message.update(message_params)
            render 'api/messages/show'
        else
            render json: @message.errors, status: :unprocessable_entity
        end
    end

    def destroy
        
        @message.destroy
    end

    private

    def set_message
        @message = Message.find(params[:id])
    end

    def message_params
        params.require(:message).permit(:content, :user_id, :channel_id)
    end
end
