class CreateMessages < ActiveRecord::Migration[7.1]
  def change
    create_table :messages do |t|
      t.text :content, null: false
      t.references :user, foreign_key: true, null: false
      t.references :channel, foreign_key: true, null: false
      
      t.timestamps
    end
  end
end
