class Api::MembershipsController < ApplicationController
    wrap_parameters include: Membership.attribute_names + ['serverId', 'userId']

    def show
        @membership = Membership.find(params[:id])
        if @membership
            render 'api/memberships/show'
        else
            render json: {error: 'Not found'}, status: 404
        end
    end
        
    def create
        @membership = Membership.new(membership_params)
        if @membership.save
            render 'api/memberships/show'
        else
            render json: @membership.errors, status: :unprocessable_entity
        end
    end

    def update
        @membership = Membership.find_by(id: params[id])
        if @membership && @membership.update(membership_params)
            render :index
        else
            render json: {errors: 'Failed to update'}, status: 404
        end
    end    

    def destroy
        @membership = Membership.find(params[:id])
        if @membership
            @membership.destroy
            head :no_content
        else
            render json: {error: 'Failed to delete'}, status: 404
        end
    end

    private

    def membership_params
        params.require(:membership).permit(:user_id, :server_id)
    end
end
