class Api::DmsController < ApplicationController
    before_action :require_logged_in

    def create
        other_id = params[:user_id].to_i
        other = User.find_by(id: other_id)
        return render(json: { errors: 'User not found' }, status: 404) unless other
        return render(json: { errors: 'Cannot DM yourself' }, status: 422) if other.id == current_user.id

        existing = Server
            .joins(:memberships)
            .where(dm_server: true, memberships: { user_id: current_user.id })
            .joins('INNER JOIN memberships AS other_m ON other_m.server_id = servers.id')
            .where('other_m.user_id = ?', other.id)
            .group('servers.id')
            .having('COUNT(memberships.id) >= 1')
            .first

        @server = existing || begin
            srv = Server.create!(
                name: "@#{current_user.username} & @#{other.username}",
                owner_id: current_user.id,
                dm_server: true
            )
            Channel.create!(name: 'dm', server_id: srv.id)
            Membership.find_or_create_by(user_id: other.id, server_id: srv.id)
            srv
        end

        render 'api/servers/show'
    end
end
