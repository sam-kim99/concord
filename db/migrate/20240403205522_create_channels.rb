class CreateChannels < ActiveRecord::Migration[7.1]
  def change
    create_table :channels do |t|
      t.string :name, null: false
      t.references :server, foreign_key: true, null: false
      t.timestamps
    end
  end
end
