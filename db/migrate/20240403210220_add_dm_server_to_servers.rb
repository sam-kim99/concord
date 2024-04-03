class AddDmServerToServers < ActiveRecord::Migration[7.1]
  def change
    add_column :servers, :dm_server, :boolean, default: false
  end
end
