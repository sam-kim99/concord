class Api::MembershipsController < ApplicationController
    wrap_parameters include: Membership.attribute_names

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

    def destroy
        @membership = Membership.find(params[:id])
        @membership.destroy
        head :no_content
    end

    private

    def membership_params
        params.require(:membership).permit(:user_id, :server_id)
    end
end
