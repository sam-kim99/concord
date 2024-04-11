# == Schema Information
#
# Table name: users
#
#  id              :bigint           not null, primary key
#  username        :string           not null
#  email           :string           not null
#  password_digest :string           not null
#  session_token   :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
class User < ApplicationRecord
    before_validation :ensure_session_token

    # Associations
    has_many :memberships, dependent: :destroy
    has_many :servers, through: :memberships
    has_many :friendships, dependent: :destroy
    has_many :friends, through: :friendships
    has_many :admin_memberships, -> { where admin: true }, class_name: 'Membership'
    has_many :admin_servers, through: :admin_memberships, source: :server
    has_many :messages, dependent: :destroy
    has_many :owned_servers,
        foreign_key: :owner_id,
        class_name: :Server,
        dependent: :destroy

    has_secure_password

    # Validations
    validates :username, 
            presence: true,
            uniqueness: true, 
            length: { in: 3..40 }, 
            format: { without: URI::MailTo::EMAIL_REGEXP, message:  "can't be an email" }
    validates :email, 
        presence: true,
        uniqueness: true, 
        length: { in: 3..100 }, 
        format: { with: URI::MailTo::EMAIL_REGEXP, message: "is not a valid email" }
    validates :session_token, presence: true, uniqueness: true
    validates :password, length: { in: 6..40 }, allow_nil: true


    def self.find_by_credentials(credential, password)
        if credential.match?(URI::MailTo::EMAIL_REGEXP)
            user = User.find_by(email: credential)
        else
            user = User.find_by(username: credential)
        end

        if user&.authenticate(password)
            user
        else
            nil
        end
    end

    def reset_session_token!
        self.session_token = generate_unique_session_token
        save!
        session_token
    end

    def ensure_session_token
        self.session_token ||= generate_unique_session_token
    end

    private
    def generate_unique_session_token
        loop do
            token = SecureRandom.urlsafe_base64
            return token unless User.exists?(session_token: token)
        end
    end
end
