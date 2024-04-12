json.extract! @message, :id, :user_id, :content, :created_at, :updated_at
json.author @message.user.username
json.time @message.created_at.to_time.localtime.strftime('%l:%M %p')
json.date @message.created_at.to_time.localtime.strftime('%B%_e, %Y')