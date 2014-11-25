class CreateClasificacionDocumentoAcademicos < ActiveRecord::Migration
  def self.up
    create_table :clasificacion_documento_academico do |t|
    end
  end

  def self.down
    drop_table :clasificacion_documento_academico
  end
end
