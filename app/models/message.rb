class Message < ApplicationRecord
    # Associations
    belongs_to :user
    belongs_to :channel
    
    # Validations
    validates :content, presence: true
end
