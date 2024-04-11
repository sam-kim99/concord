# == Schema Information
#
# Table name: channels
#
#  id         :bigint           not null, primary key
#  name       :string           not null
#  server_id  :bigint           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Channel < ApplicationRecord
    # Associations
    belongs_to :server
    has_many :messages, dependent: :destroy
    
    # Validations
    validates :name, presence: true, uniqueness: { scope: :server_id }
end
