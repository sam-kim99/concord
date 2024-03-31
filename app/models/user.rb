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
    has_secure_password
    before_validation :ensure_session_token

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
