# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
require 'faker'

ApplicationRecord.transaction do
    puts "Destroying tables.."
    Friendship.destroy_all
    Membership.destroy_all
    Message.destroy_all
    Channel.destroy_all
    Server.destroy_all
    User.destroy_all

    puts "Resetting primary keys..."
    ApplicationRecord.connection.reset_pk_sequence!('users')
    ApplicationRecord.connection.reset_pk_sequence!('servers')
    ApplicationRecord.connection.reset_pk_sequence!('channels')
    ApplicationRecord.connection.reset_pk_sequence!('messages')
    ApplicationRecord.connection.reset_pk_sequence!('memberships')
    ApplicationRecord.connection.reset_pk_sequence!('friendships')

    puts "Seeding Users..."

    User.create!(
        username: 'SuperCoolGuy331',
        email: 'supercoolguy331@test.com',
        password: 'password!!!'
    )

    User.create!(
        username: 'ReallyAwesomeSauce369',
        email: 'ketchup@test.com',
        password: 'must@rdreallysucks'
    )

    10.times do
        User.create!(
          username: Faker::Internet.unique.username,
          email: Faker::Internet.unique.email,
          password: 'password123'
        )
    end

    puts "Seeding Servers..."

    Server.create!(
        name: 'something really awesome',
        owner_id: 1,
        dm_server: false
    )

    Server.create!(
        name: 'rails rules',
        owner_id: 1,
        dm_server: false
    )

    Server.create!(
        name: 'more of a react guy myself',
        owner_id: 1,
        dm_server: false
    )

    Server.create!(
        name: 'Cloud9 Prac Room',
        owner_id: 1,
        dm_server: false
    )

    Server.create!(
        name: 'super happy fun time',
        owner_id: 1,
        dm_server: false
    )

    Server.create!(
        name: 'pickleball practice',
        owner_id: 2,
        dm_server: false
    )

    Server.create!(
        name: 'FriendsNFamily',
        owner_id: 2,
        dm_server: false
    )

    Server.create!(
        name: 'CODING IS COOL',
        owner_id: 2,
        dm_server: false
    )
    
    Server.create!(
        name: 'App Academy',
        owner_id: 2,
        dm_server: false
    )

    Membership.create(user_id: 1, server_id: 9, admin: false)

    Server.create!(
        name: 'React Fan Club',
        owner_id: 2,
        dm_server: false
    )

    Server.all.each do |server|
        3.times do
            user_id = User.all.sample.id
            Membership.create(user_id: user_id, server_id: server.id, admin: false) unless (user_id == server.owner_id)
        end
    end

    puts "Seeding Channels..."

    Channel.create!(
        name: 'general',
        server_id: 1
    )
    
    Channel.create!(
        name: 'general',
        server_id: 2
    )
    
    Channel.create!(
        name: 'general',
        server_id: 3
    )
    
    Channel.create!(
        name: 'general',
        server_id: 4
    )
    
    Channel.create!(
        name: 'general',
        server_id: 5
    )
    
    Channel.create!(
        name: 'general',
        server_id: 6
    )
    
    Channel.create!(
        name: 'general',
        server_id: 7
    )
    
    Channel.create!(
        name: 'general',
        server_id: 8
    )
    
    Channel.create!(
        name: 'general',
        server_id: 9
    )
    
    Channel.create!(
        name: 'general',
        server_id: 10
    )
    
    Channel.create!(
        name: 'awesome-sauce',
        server_id: 1
    )
    
    Channel.create!(
        name: 'anti-react-club',
        server_id: 2
    )

    Channel.create!(
        name: 'anti-rails-club',
        server_id: 3
    )


    puts "Seeding Messages..."

    Message.create([
        { content: "Hey everyone!", user_id: 1, channel_id: 1 },
        { content: "How's it going?", user_id: 2, channel_id: 1 },
        { content: "Nice weather we're having!", user_id: 3, channel_id: 1 },

        { content: "Welcome to our channel!", user_id: 4, channel_id: 2 },
        { content: "Excited to chat with everyone!", user_id: 5, channel_id: 2 },
        { content: "Let's get the conversation started!", user_id: 6, channel_id: 2 },

        { content: "Good morning!", user_id: 7, channel_id: 3 },
        { content: "Ready for a productive day!", user_id: 8, channel_id: 3 },
        { content: "Coffee anyone?", user_id: 9, channel_id: 3 },

        { content: "What's up everyone?", user_id: 10, channel_id: 4 },
        { content: "Any plans for the weekend?", user_id: 11, channel_id: 4 },
        { content: "Let's have a great day!", user_id: 12, channel_id: 4 },

        { content: "Happy Monday!", user_id: 1, channel_id: 5 },
        { content: "New week, new goals!", user_id: 2, channel_id: 5 },
        { content: "Let's crush it this week!", user_id: 3, channel_id: 5 },

        { content: "Hello from channel 6!", user_id: 4, channel_id: 6 },
        { content: "Any exciting news to share?", user_id: 5, channel_id: 6 },
        { content: "Let's make this channel lively!", user_id: 6, channel_id: 6 },

        { content: "Greetings!", user_id: 7, channel_id: 7 },
        { content: "What's on your mind?", user_id: 8, channel_id: 7 },
        { content: "Let's have some fun discussions!", user_id: 9, channel_id: 7 },

        { content: "Hola amigos!", user_id: 10, channel_id: 8 },
        { content: "Cómo están?", user_id: 11, channel_id: 8 },
        { content: "Listos para una buena conversación?", user_id: 12, channel_id: 8 },

        { content: "Hey there!", user_id: 1, channel_id: 9 },
        { content: "What's new?", user_id: 2, channel_id: 9 },
        { content: "Let's make this channel vibrant!", user_id: 3, channel_id: 9 },

        { content: "Greetings from channel 10!", user_id: 4, channel_id: 10 },
        { content: "How's everyone doing today?", user_id: 5, channel_id: 10 },
        { content: "Let's have some insightful discussions!", user_id: 6, channel_id: 10 },

        { content: "thoughts on bbq?", user_id: 4, channel_id: 11 },
        { content: "its ok, i prefer sweet and sour!!", user_id: 5, channel_id: 11 },
        { content: "im a no-saucer", user_id: 6, channel_id: 11 },

        { content: "these front-end developers am i right?!?!", user_id: 1, channel_id: 12 },
        { content: "so obnoxious", user_id: 4, channel_id: 12 },
        { content: "react to this!", user_id: 8, channel_id: 12 },

        { content: "these back-end developers am i right?!?!", user_id: 2, channel_id: 13 },
        { content: "ooo ruby look at me so precious", user_id: 3, channel_id: 13 },
        { content: "theyre off the rails!!! hahaha...", user_id: 7, channel_id: 13 },
        { content: "guys???", user_id: 7, channel_id: 13 }
    ])
    
    puts "Seeding complete."
end