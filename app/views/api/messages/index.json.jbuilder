@messages.each do |msg|
    json.set! msg.id do
        json.extract! msg, :id, :user_id, :content, :created_at, :updated_at
        json.author msg.user.username
        json.time msg.created_at.to_time.localtime.strftime('%l:%M %p')
        json.date msg.created_at.to_time.localtime.strftime('%B%_e, %Y')
    end
end
