class CreateMemberships < ActiveRecord::Migration[7.1]
  def change
    create_table :memberships do |t|
      t.references :user, foreign_key: true, null: false
      t.references :server, foreign_key: true, null: false
      t.boolean :admin, default: false
      t.timestamps
    end
  end
end
