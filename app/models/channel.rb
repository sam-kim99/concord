class Channel < ApplicationRecord
    # Associations
    belongs_to :server
    has_many :messages
    
    # Validations
    validates :name, presence: true
end
