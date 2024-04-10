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

    Server.create!(
        name: 'React Fan Club',
        owner_id: 2,
        dm_server: false
    )

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
    
    puts "Seeding complete."
end