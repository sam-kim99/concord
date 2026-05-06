json.extract! @friendship, :id, :user_id, :friend_id, :status, :created_at
json.user_username @friendship.user.username
json.friend_username @friendship.friend.username
