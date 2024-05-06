json.extract! @server, :id, :name
json.ownerId @server.owner_id

json.users @server.users do |user|
  json.extract! user, :id, :username
end

json.channels @server.channels do |channel|
  json.extract! channel, :id, :name
end