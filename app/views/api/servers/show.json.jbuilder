json.extract! @server, :id, :name, :owner_id, :created_at, :updated_at, :dm_server
json.channels @server.channels.map(&:id)
json.members @server.memberships.map(&:user_id)