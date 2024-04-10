# == Schema Information
#
# Table name: friendships
#
#  id         :bigint           not null, primary key
#  user_id    :bigint           not null
#  friend_id  :bigint           not null
#  status     :string           default("pending"), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Friendship < ApplicationRecord
    # Associations
    belongs_to :user
    belongs_to :friend, class_name: 'User'
    
    # Validations
    validates :user_id, :friend_id, presence: true
    validates :user_id, uniqueness: { scope: :friend_id }
    validates :status, presence: true, inclusion: { in: %w(pending accepted rejected) }
end
