class PublicacionesApi < ActionWebService::API::Base
  api_method :teg_marcar_subido, :expects => [:string, :string], :returns => [:bool]
  api_method :teg_subido, :expects => [:string, :string], :returns => [:bool]
  api_method :tiene_planilla, :expects => [:string, :string], :returns => [:bool]
  api_method :fecha_publicacion_teg, :expects => [:string, :string], :returns => [:string]
  api_method :tutor_teg, :expects => [:string, :string], :returns => [:string]
  api_method :titulo_teg, :expects => [:string, :string], :returns => [:string]
  api_method :ok, :expects => [], :returns => [:bool]
end


