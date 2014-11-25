class CreatePalabras < ActiveRecord::Migration
  def self.up
    create_table :palabra do |t|
    end
  end

  def self.down
    drop_table :palabra
  end
end
