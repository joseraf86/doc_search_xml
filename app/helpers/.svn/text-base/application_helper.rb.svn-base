# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper

  def xbr(i=1)
    return "<div style=\"padding: #{i*3}px 0px #{i*3}px 0px; border: 0px solid #000;\"></div>"
  end
  


  parametros_generales = ["host_conest_estudiantes", "host_conest_admin"]

  parametros_generales.each{ |parametro|
    define_method(parametro){
      return ParametroGeneral.find(parametro).valor
    }
  }
  
  
end
