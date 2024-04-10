class Api::ServersController < ApplicationController
    wrap_parameters include: Server.attribute_names
    before_action :set_server, only: [:show, :update, :destroy]
    
    def show
        render 'api/servers/show'
    end

    def index
        @servers = Server.where(owner_id: current_user.id)
        render 'api/servers/index'
    end

    def create
        @server = Server.new(server_params)
    
        if @server.save
            Channel.create({name: 'general', server_id: @server.id})
            render 'api/servers/show'
        else
            render json: @server.errors, status: 404
        end
    end

    def update
        if @server.owner_id === current_user.id
            if @server.update(server_params)
                render 'api/servers/show'
            else
                render json: @server.errors, status: 404
            end
        else
            render json: ["You do not have permission to update this server"], status: 403
        end
    end
    

    def destroy
        if @server.owner_id == current_user.id
            @server.destroy
            render :show
        else
            render json: ["You do not have permission to delete this server"], status: 403
        end
    end
    
    private

    def set_server
        @server = Server.find(params[:id])
    end

    def server_params
        params.require(:server).permit(:name, :owner_id)
    end

end
