class Api::MembershipsController < ApplicationController
    wrap_parameters include: Membership.attribute_names + ['serverId', 'userId']

    before_action :require_logged_in
    before_action :set_membership, only: [:show, :update, :destroy]
    before_action :verify_index_server_member, only: [:index]
    before_action :verify_show_server_member, only: [:show]

    def index
        @memberships = Membership.where(server_id: params[:server_id]).includes(:user)
        render 'api/memberships/index'
    end

    def show
        render 'api/memberships/show'
    end

    def create
        @membership = Membership.new(membership_params)
        @membership.user_id ||= current_user.id

        if @membership.user_id != current_user.id
            render json: { errors: 'Cannot create a membership for another user' }, status: 403
            return
        end

        if @membership.save
            render 'api/memberships/show'
        else
            render json: @membership.errors, status: :unprocessable_entity
        end
    end

    def update
        unless @membership.server.owner_id == current_user.id
            render json: { errors: 'Only the server owner can update memberships' }, status: 403
            return
        end

        if @membership.update(membership_params.slice(:admin))
            render 'api/memberships/show'
        else
            render json: { errors: @membership.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def destroy
        is_self = @membership.user_id == current_user.id
        is_owner = @membership.server.owner_id == current_user.id

        unless is_self || is_owner
            render json: { errors: 'Not authorized' }, status: 403
            return
        end

        if @membership.user_id == @membership.server.owner_id
            render json: { errors: 'Server owner cannot leave the server' }, status: :unprocessable_entity
            return
        end

        @membership.destroy
        head :no_content
    end

    private

    def set_membership
        @membership = Membership.find_by(id: params[:id])
        render(json: { errors: 'Not found' }, status: 404) and return unless @membership
    end

    def membership_params
        params.require(:membership).permit(:user_id, :server_id, :admin)
    end

    def verify_index_server_member
        unless Membership.exists?(server_id: params[:server_id], user_id: current_user.id)
            render json: { errors: 'Not a member of this server' }, status: :forbidden
        end
    end

    def verify_show_server_member
        unless Membership.exists?(server_id: @membership.server_id, user_id: current_user.id)
            render json: { errors: 'Not a member of this server' }, status: :forbidden
        end
    end
end
