json.user do
    json.extract! @user, :id, :username, :email, :created_at
end
