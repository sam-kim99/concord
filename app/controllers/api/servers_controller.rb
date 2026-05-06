class Api::ServersController < ApplicationController
    wrap_parameters include: Server.attribute_names
    before_action :require_logged_in
    before_action :set_server, only: [:show, :update, :destroy]
    before_action :verify_server_member, only: [:show]
    
    def show
        render 'api/servers/show'
    end

    def index
        @servers = Server.joins(:memberships).where(memberships: { user_id: current_user.id })
        render 'api/servers/index'
    end

    def create
        @server = Server.new(server_params)
        @server.owner_id = current_user.id

        if @server.save
            @server.channels.create(name: 'general')
            render 'api/servers/show'
        else
            render json: @server.errors, status: :unprocessable_entity
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

    def verify_server_member
        unless Membership.exists?(server_id: @server.id, user_id: current_user.id)
            render json: { errors: 'Not a member of this server' }, status: 403
        end
    end

    def server_params
        params.require(:server).permit(:name, :owner_id)
    end

end
