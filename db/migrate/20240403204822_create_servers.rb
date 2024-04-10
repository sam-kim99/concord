class CreateServers < ActiveRecord::Migration[7.1]
  def change
    create_table :servers do |t|
      t.string :name, null: false
      t.references :owner, foreign_key: { to_table: :users }, null: false
      t.timestamps
    end
  end
end
