module DocumentoHelper

  MaximoPaginasPorVista = 20

  def links_paginacion(paginador)
    return "" if paginador.cantidad_paginas == 1
    indice_ultima_vista = (paginador.cantidad_paginas - 1) / MaximoPaginasPorVista
    indice_vista_actual = (paginador.pagina_actual - 1) / MaximoPaginasPorVista
    primera_pagina = (indice_vista_actual * MaximoPaginasPorVista) + 1
    if indice_ultima_vista > 0
      ultima_pagina = (indice_vista_actual * MaximoPaginasPorVista) + MaximoPaginasPorVista
      ultima_pagina = (indice_vista_actual * MaximoPaginasPorVista) + (paginador.pagina_actual % indice_ultima_vista) if (indice_vista_actual == indice_ultima_vista and (paginador.pagina_actual % indice_ultima_vista) > 0)
    else
      ultima_pagina = paginador.cantidad_paginas
    end
    link_vista_anterior = [""]
    link_vista_anterior = [link_to("<<", :action => "resultado_consulta", :id => "#{(indice_vista_actual-1)*MaximoPaginasPorVista+1}")] if indice_vista_actual != 0
    links_paginas = (primera_pagina .. ultima_pagina).to_a.collect{ |i|
      if i != @paginador.pagina_actual
        link_to("#{i}", :action => "resultado_consulta", :id => "#{i}")
      else
        i
      end
    }
    link_vista_siguiente = [""]
    link_vista_siguiente = [link_to(">>", :action => "resultado_consulta", :id => "#{(indice_vista_actual+1)*MaximoPaginasPorVista+1}")] if indice_vista_actual != indice_ultima_vista
    retorno = (link_vista_anterior + links_paginas + link_vista_siguiente).join(" ")
    return "<div id = \"paginacion\">#{retorno}</div>"
  end
  
  
  def info_paginacion_actual(paginador)
    indice_li = paginador.indice_pagina_actual*paginador.objetos_por_pagina
    return ("Documentos encontrados: <b>#{indice_li+1}</b> - <b>#{indice_li+@documentos.size}</b> de un total de <b>#{paginador.claves_primarias.size}</b>")
  end
  
  def info_busqueda_avanzada(busqueda)
  
    retorno = "<div id = \"info_busqueda_avanzada\">"
    retorno += "<b>Busqueda avanzada: </b>"
    retorno += "<i>#{escape_javascript busqueda.info}</i> "
    retorno += "  "
    retorno += link_to("Volver a buscar",:action => "busqueda_avanzada")
    retorno += "</div>"
    return retorno
  end

end


