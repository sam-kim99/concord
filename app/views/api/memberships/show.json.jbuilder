json.membership do
    json.extract! @membership, :id, :created_at, :user_id, :server_id, :admin
end