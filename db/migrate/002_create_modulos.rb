class CreateModulos < ActiveRecord::Migration
  def self.up
    create_table :modulo do |t|
    end
  end

  def self.down
    drop_table :modulo
  end
end
