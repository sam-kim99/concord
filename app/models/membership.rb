class Membership < ApplicationRecord
    # Associations
    belongs_to :user
    belongs_to :server
  
    # Validations
    validates :user_id, uniqueness: { scope: :server_id }
end
