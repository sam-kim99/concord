json.friendship do
    json.extract! @friendship, :id, :user_id, :friend_id, :status
end

json.accepted @friendship.friend.friendships.exists?(user_id: @friendship.user_id)
