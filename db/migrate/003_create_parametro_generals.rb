class CreateParametroGenerals < ActiveRecord::Migration
  def self.up
    create_table :parametro_general do |t|
    end
  end

  def self.down
    drop_table :parametro_general
  end
end
