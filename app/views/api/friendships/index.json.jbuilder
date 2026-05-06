json.array! @friendships do |f|
    json.extract! f, :id, :user_id, :friend_id, :status, :created_at
    json.user_username  f.user.username
    json.friend_username f.friend.username
end
