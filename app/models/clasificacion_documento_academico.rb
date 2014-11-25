class ClasificacionDocumentoAcademico < ActiveRecord::Base
  ID_TRABAJO_ESPECIAL_DE_GRADO = 1
  ID_SEMINARIO = 2
  ID_PASANTIA = 3
  
  def peso
   1.2
  end
end

