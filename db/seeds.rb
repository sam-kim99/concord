require 'faker'

ApplicationRecord.transaction do
    puts "Destroying tables..."
    Friendship.destroy_all
    Membership.destroy_all
    Message.destroy_all
    Channel.destroy_all
    Server.destroy_all
    User.destroy_all

    puts "Resetting primary keys..."
    %w[users servers channels messages memberships friendships].each do |t|
        ApplicationRecord.connection.reset_pk_sequence!(t)
    end

    puts "Seeding users..."

    demo1 = User.create!(
        username: 'SuperCoolGuy331',
        email: 'supercoolguy331@test.com',
        password: 'password!!!'
    )

    demo2 = User.create!(
        username: 'ReallyAwesomeSauce369',
        email: 'ketchup@test.com',
        password: 'must@rdreallysucks'
    )

    bulk_users = []
    30.times do
        bulk_users << User.create!(
            username: Faker::Internet.unique.username(specifier: 5..15, separators: %w[_ .]),
            email:    Faker::Internet.unique.email,
            password: 'password123'
        )
    end

    all_users = [demo1, demo2] + bulk_users

    puts "Seeding servers and channels..."

    server_themes = [
        { name: 'Gaming Lounge',     owner: demo1,         channels: %w[general looking-for-group screenshots memes patch-notes] },
        { name: 'Music Producers',   owner: demo1,         channels: %w[general feedback releases gear-talk samples] },
        { name: 'Study Hall',        owner: demo1,         channels: %w[general pomodoro questions wins] },
        { name: 'Movie Night',       owner: demo2,         channels: %w[general recommendations now-watching spoilers] },
        { name: 'Foodies United',    owner: demo2,         channels: %w[general recipes restaurants meal-prep coffee] },
        { name: 'Book Club',         owner: demo2,         channels: %w[general currently-reading recommendations] },
        { name: 'Devs Den',          owner: bulk_users[0], channels: %w[general frontend backend devops help interviews] },
        { name: 'Hiking & Outdoors', owner: bulk_users[1], channels: %w[general trip-reports gear photos] },
        { name: 'Art Studio',        owner: bulk_users[2], channels: %w[general wip critique inspiration] },
        { name: 'Pet Owners',        owner: bulk_users[3], channels: %w[general dogs cats training-tips] }
    ]

    servers = server_themes.map do |theme|
        server = Server.create!(name: theme[:name], owner_id: theme[:owner].id, dm_server: false)
        theme[:channels].each do |name|
            Channel.find_or_create_by!(name: name, server_id: server.id)
        end
        server
    end

    puts "Seeding memberships..."

    servers.each do |server|
        member_count = rand(8..15)
        candidates = (all_users - [server.owner, demo1, demo2]).shuffle.first(member_count)
        candidates.each do |u|
            Membership.find_or_create_by(user_id: u.id, server_id: server.id) { |m| m.admin = false }
        end
        # Make sure both demos are members of every themed server so the demo experience is rich
        [demo1, demo2].each do |u|
            Membership.find_or_create_by(user_id: u.id, server_id: server.id) { |m| m.admin = false }
        end
    end

    puts "Seeding friendships..."

    # Demo accounts are friends with each other
    Friendship.create!(user_id: demo1.id, friend_id: demo2.id, status: 'accepted')
    Friendship.create!(user_id: demo2.id, friend_id: demo1.id, status: 'accepted')

    demo1_friends = bulk_users.sample(6)
    demo1_friends.each do |u|
        Friendship.create!(user_id: demo1.id, friend_id: u.id, status: 'accepted')
        Friendship.create!(user_id: u.id, friend_id: demo1.id, status: 'accepted')
    end

    demo2_friends = (bulk_users - demo1_friends).sample(5)
    demo2_friends.each do |u|
        Friendship.create!(user_id: demo2.id, friend_id: u.id, status: 'accepted')
        Friendship.create!(user_id: u.id, friend_id: demo2.id, status: 'accepted')
    end

    # Pending requests sent TO demo1
    pending_to_demo1 = (bulk_users - demo1_friends - demo2_friends).sample(3)
    pending_to_demo1.each do |u|
        Friendship.create!(user_id: u.id, friend_id: demo1.id, status: 'pending')
    end

    # Pending requests sent FROM demo2
    pending_from_demo2 = (bulk_users - demo1_friends - demo2_friends - pending_to_demo1).sample(2)
    pending_from_demo2.each do |u|
        Friendship.create!(user_id: demo2.id, friend_id: u.id, status: 'pending')
    end

    puts "Seeding DM servers..."

    dm_pairs = [[demo1, demo2]] +
               demo1_friends.map { |u| [demo1, u] } +
               demo2_friends.map { |u| [demo2, u] }

    dm_pairs.each do |a, b|
        dm = Server.create!(name: "@#{a.username} & @#{b.username}", owner_id: a.id, dm_server: true)
        Channel.create!(name: 'dm', server_id: dm.id)
        Membership.find_or_create_by(user_id: b.id, server_id: dm.id) { |m| m.admin = false }
    end

    puts "Seeding messages..."

    themed_lines = {
        'general'           => ['hey everyone!', 'morning all', 'how was everyone\'s weekend?', 'this server is alive!', 'just dropping in to say hi', 'gm', 'what is everyone up to today?', 'happy friday!', 'long time no chat', 'ayy'],
        'looking-for-group' => ['anyone down for ranked tonight?', '2 more for raid, msg me', 'lfg around 8pm est', 'bronze player here, no pressure', 'queueing now if anyone wants to join', 'need a healer for our run'],
        'screenshots'       => ['caught this clip last night, look at the killcam', 'finally hit diamond!', 'this view in the new map is unreal', 'photo mode is too good', 'low-key proud of this build'],
        'memes'             => ['absolute cinema', '😂', 'this is too real', 'send help', 'we eating good tonight', 'lol no thoughts head empty', 'not me at 2am'],
        'patch-notes'       => ['nerf when', 'rip my main', 'this patch slaps', 'the new ability is broken', 'finally fixed the lobby bug'],
        'feedback'          => ['the kick on this track is so clean', 'i\'d pull the lead back maybe 2db', 'love the vibe but the bridge feels long', 'mix sounds great in the car', 'try sidechaining the pad'],
        'releases'          => ['new EP is out today!! 🎧', 'my track just hit 10k streams', 'soft launch tomorrow, wish me luck', 'finally finished mastering', 'releasing on friday across all platforms'],
        'gear-talk'         => ['anyone using the new MPC?', 'sold my OP-1, regret it already', 'best vst for analog warmth?', 'just got a moog matriarch and i\'m never coming back', 'thrift store synth find of the century'],
        'samples'           => ['drop your favorite sample pack', 'splice >>> all', 'looking for vintage drum breaks', 'free sample pack i made: link in dm'],
        'pomodoro'          => ['starting a 25min focus block, who\'s in?', 'break time, see you in 5', 'finished my third cycle, brain melting', 'midterm tomorrow, sending it'],
        'questions'         => ['can someone explain big-O?', 'what\'s the difference between SQL and NoSQL?', 'studying for the GRE, any tips?', 'how do you stay focused?'],
        'wins'              => ['just landed an interview!! 🎉', 'finally finished my thesis', 'aced my final', 'got the internship'],
        'recommendations'   => ['watch Past Lives if you haven\'t', 'currently obsessed with Severance', 'anything horror you\'d recommend?', 'Letterboxd just told me i\'m basic'],
        'now-watching'      => ['halfway through the bear s3', 'rewatching the office for the 5th time', 'just hit play on dune part two'],
        'spoilers'          => ['i did not see that twist coming', 'spoilers ahead!!', 'who else cried at the ending', 'so are we all good with how it ended or'],
        'recipes'           => ['weeknight chili recipe in dm', 'this brown butter pasta changed my life', 'air fryer salmon, 8 minutes, life-changing', 'sourdough loaf #4 came out perfect today'],
        'restaurants'       => ['that new ramen spot downtown is legit', 'avoid the place on 5th, slow service', 'bday dinner suggestions in queens?', 'tried the omakase at sushi yasaka, worth it'],
        'meal-prep'         => ['sunday meal prep done in 90 min', 'cottage cheese is the move', 'easy lunches: sheet pan everything', 'my freezer is 80% chicken thighs'],
        'coffee'            => ['v60 over chemex any day', 'finally got a comandante and wow', 'medium roast supremacy', 'oat milk haters dni'],
        'currently-reading' => ['halfway through tomorrow and tomorrow and tomorrow', 'rereading the goldfinch', 'project hail mary so far is amazing', 'butter\'s asaka was a slog tbh'],
        'frontend'          => ['react query > redux for server state, fight me', 'tailwind is fine, actually', 'spent an hour on a flexbox bug, embarrassing', 'css grid still magic'],
        'backend'           => ['n+1 query lurking in this PR, beware', 'postgres is the answer 95% of the time', 'rails 7.1 hotwire stack feels great', 'auth is always more work than you think'],
        'devops'            => ['my k8s cluster is screaming again', 'terraform plan is the new prayer', 'finally migrated off heroku', 'docker layer caching saved my life'],
        'help'              => ['stuck on a cors issue, anyone awake?', 'why is my migration not running???', 'cookie not setting in safari, classic', 'merge conflict help pls'],
        'interviews'        => ['just bombed a system design lol', 'leetcode hard before bed = ill-advised', 'got the offer!!! 🎉', 'recruiter ghosted me again'],
        'trip-reports'      => ['just got back from yosemite, 14mi day, knees crying', 'cleared half dome cables, surreal', 'rainier next month, tips welcome', 'pct section J was rough but worth it'],
        'gear'              => ['osprey atmos AG 65 still goated', 'darn tough socks pay for themselves', 'merino base layer or bust', 'finally upgraded my tent, weight savings massive'],
        'photos'            => ['caught the alpenglow this morning', 'this trail in autumn is unreal', 'see attached: marmot at 11k feet'],
        'wip'               => ['still tweaking the lighting', 'lineart done, color tomorrow', 'this is taking forever but i love it'],
        'critique'          => ['composition feels off in the upper third', 'love it, maybe push the saturation down a notch', 'the figure reads great', 'edges are too crisp, soften with a blur layer'],
        'inspiration'       => ['kim jung gi never gets old', 'studio ghibli backgrounds = always', 'just discovered moebius, life ruined (in a good way)'],
        'dogs'              => ['my golden just learned to ring the door bell', 'puppy training tip: high value treats only', 'recall is everything', 'beach day pics incoming'],
        'cats'              => ['my cat just knocked over my coffee', 'cats > everything', 'the 3am zoomies are real', 'kitten attached to the ceiling, please advise'],
        'training-tips'     => ['clicker training changed my life', 'consistency > duration', 'reward, mark, repeat'],
        'dm'                => ['hey!', 'omw', 'lol', 'did you see that thing i sent', 'sorry just saw this', 'lunch tomorrow?', 'on it', 'be there in 10', 'sounds good', 'haha facts', '😂😂', 'gn']
    }

    pick_themed = ->(channel_name) {
        themed = themed_lines[channel_name]
        themed && themed.sample
    }

    base_time = 45.days.ago

    Channel.find_each do |channel|
        members = channel.server.memberships.map(&:user)
        next if members.empty?

        message_count = channel.server.dm_server ? rand(8..30) : rand(15..50)
        cursor = base_time + rand(0..3).days

        message_count.times do |i|
            cursor += rand(2..1800).minutes
            break if cursor > 5.minutes.ago

            line = pick_themed.call(channel.name) ||
                   ([Faker::Lorem.sentence(word_count: rand(3..14)),
                     Faker::Hipster.sentence(word_count: rand(3..10))].sample)

            line += "\n#{Faker::Lorem.sentence}" if rand < 0.05
            line += " #{Faker::Internet.url}" if rand < 0.04

            Message.create!(
                content:    line,
                user_id:    members.sample.id,
                channel_id: channel.id,
                created_at: cursor,
                updated_at: cursor
            )
        end
    end

    puts "Seeding complete."
    puts "  Users:       #{User.count}"
    puts "  Servers:     #{Server.count} (DMs: #{Server.where(dm_server: true).count})"
    puts "  Channels:    #{Channel.count}"
    puts "  Memberships: #{Membership.count}"
    puts "  Friendships: #{Friendship.count}"
    puts "  Messages:    #{Message.count}"
end
