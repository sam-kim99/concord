# == Schema Information
#
# Table name: servers
#
#  id         :bigint           not null, primary key
#  name       :string           not null
#  owner_id   :bigint           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  dm_server  :boolean          default(FALSE)
#
class Server < ApplicationRecord
    after_create :add_owner_as_member
    # Associations
    has_many :memberships, dependent: :destroy
    has_many :members, through: :memberships, source: :user
    has_many :channels, dependent: :destroy
    belongs_to :owner, class_name: 'User', foreign_key: 'owner_id'
    has_many :messages, through: :channels
  
    # Validations
    validates :name, :owner_id, presence: true

    private

    def add_owner_as_member
        memberships.create(user_id: owner_id, admin: true)
    end
end
