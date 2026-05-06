json.array! @memberships do |membership|
    json.extract! membership, :id, :user_id, :server_id, :admin, :created_at
    json.username membership.user.username
end
