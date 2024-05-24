@servers.each do |server|
  json.set! server.id do
    json.extract! server, :id, :name, :owner_id, :created_at, :updated_at, :dm_server
    json.channels server.channels.map(&:id)
    json.members server.memberships.map(&:id)
  end
    # json.url server_url(server, format: :json)
end
  