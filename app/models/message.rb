# == Schema Information
#
# Table name: messages
#
#  id         :bigint           not null, primary key
#  content    :text             not null
#  user_id    :bigint           not null
#  channel_id :bigint           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Message < ApplicationRecord
    # Associations
    belongs_to :user
    belongs_to :channel
    
    # Validations
    validates :content, presence: true, length: { maximum: 1000 }
end
