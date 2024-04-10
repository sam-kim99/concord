# == Schema Information
#
# Table name: memberships
#
#  id         :bigint           not null, primary key
#  user_id    :bigint           not null
#  server_id  :bigint           not null
#  admin      :boolean          default(FALSE)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Membership < ApplicationRecord
    # Associations
    belongs_to :user
    belongs_to :server
  
    # Validations
    validates :user_id, uniqueness: { scope: :server_id }

end
