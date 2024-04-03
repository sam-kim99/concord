class Server < ApplicationRecord
    # Associations
    has_many :memberships
    has_many :users, through: :memberships
    has_many :channels
  
    # Validations
    validates :name, presence: true
end
