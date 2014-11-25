
class DocumentoController < ApplicationController


  CantidadDeDocumentosPorPagina = 15
  AccionPrincipal = "busqueda_sencilla"
  #ClaveNuevoDocumento = "12345678"

  web_client_api :publicaciones, :soap, ParametroGeneral.find("host_conest_admin").valor + "/publicaciones/api"

  # filtros
  before_filter :dummy_filter

  verify :method => :post, :only => [ :buscar_sencillo, :buscar_avanzado, :nuevo ], :redirect_to => { :action => AccionPrincipal } #TODO verificar post para nuevo_documento, llenar_datos, crear
  
  ["buscar_sencillo", "buscar_avanzado", "resultado_consulta","crear", "llenar_datos"].each{ |metodo|
    before_filter :"pre_#{metodo}", :only => :"#{metodo}"
  }
  
  before_filter :verificar_conest_admin, :only => [:nuevo, :llenar_titulo_resumen, :crear]
  before_filter :verificar_nuevo_documento_en_sesion, :only => [:llenar_titulo_resumen, :crear]
  
  

  def cod_post_error_imprevisto
    %q/
    # para llamar a este codigo debe existir la variable excepcion
    puts '.:. Error imprevisto .:.', excepcion, excepcion.backtrace
    flash[:mensaje_error] = 'Ocurrió algo imprevisto, asegúrese de interactuar segun la interfaz y seguir los pasos ;)'
    redirect_to(:action => AccionPrincipal)
    return
    /
  end

  def cod_post_error_imprevisto_carga_documento
    %q/
    # para llamar a este codigo debe existir la variable excepcion
    puts '.:. Error imprevisto .:.', excepcion, excepcion.backtrace
    flash[:mensaje_error] = 'Ocurrió un error durante la carga, asegúrese de interactuar según la interfaz de la aplicacion'
    redirect_to(:action => "documento_cargado")
    return
    /
  end
  
  
  def cod_sin_resultado
    %q/
    #para llamar a este codigo debe existir la variable @busqueda
    flash[:mensaje] = "No se encontraron documentos para esta búsqueda :("
    redirect_to(:action => "busqueda_#{@busqueda.tipo}")
    return
    /
  end

  

  def index
    redirect_to(:action => AccionPrincipal)
  end
  

  def nuevo
    begin
      session[:documento] = Documento.new
      @documento = session[:documento]
      print 1
      llave_conest = params[:data]
      cadena_descifrada = llave_conest.tr(CadenaTraduccionB,CadenaTraduccionA)
      parametros_recibidos = Hash[*(cadena_descifrada.split("!"))]
      #
      raise "Error intencional: No coincide la clave proveniente de conest" if parametros_recibidos[:integridad.to_s] != "integridad"
      campos =  [:fecha_publicacion, :calificacion, :tiene_premio]
      campos += [:mencion, :licenciatura_id, :licenciatura, :escuela, :facultad, :universidad]
      campos.each{ |campo|
        # usa los metodos del objeto documento
        @documento.send "#{campo.to_s}=", parametros_recibidos[campo.to_s]
      }
      # genera directamente el xml
      xml = @documento.xml
      xml_autor = REXML::Element.new "autor"
      xml.root.add xml_autor
      campos_autor = [:nombre, :cedula, :correo, :telefonos, :promedio_general, :promedio_ponderado, :eficiencia]
      campos_autor.each{|campo|
        elem = xml_autor.add_element campo.to_s
        elem.text = "#{parametros_recibidos[campo.to_s + "_autor"]}" #asi viene de conest
      }
      @documento.metadata = xml.to_s
      # clasificacion
      @documento.clasificacion_documento_academico_id = ClasificacionDocumentoAcademico::ID_TRABAJO_ESPECIAL_DE_GRADO
      # comprueba si ya ha sido subido el documento
      print 2
      if publicaciones.teg_subido(@documento.cedula_autor1, @documento.licenciatura_id)
        print 3
	nuevo_mensaje "El documento ya ha sido cargado. Muchas gracias"
        redirect_to :action => "documento_cargado"
        return
      end
      #
      @documento.fecha_publicacion = publicaciones.fecha_publicacion_teg(@documento.cedula_autor1, @documento.licenciatura_id)
      @documento.tutor = publicaciones.tutor_teg(@documento.cedula_autor1, @documento.licenciatura_id)
      @documento.titulo=publicaciones.titulo_teg(@documento.cedula_autor1, @documento.licenciatura_id)
      #
      render(:action => 'subir_archivo', :layout => 'conest')
      return
    rescue Exception => excepcion
      eval cod_post_error_imprevisto
    end
  end
  
  
  def llenar_titulo_resumen
    if File.size(session[:upload_progress][:nombre_archivo_temporal]) < 1000
      nuevo_mensaje("El documento no ha podido ser subido al sistema", :error)
      redirect_to(:action => "documento_cargado")
      return
    end
    render(:layout => 'conest')
    return
  end
  
  
  
  def crear
    borrar_mensajes
    archivo = File.new( session[:upload_progress][:nombre_archivo_temporal],"r")
    @documento.archivo = archivo.read
    #@documento.md5 = Digest::MD5.hexdigest(@documento.archivo)
    @documento.md5 = self.class.md5sum(session[:upload_progress][:nombre_archivo_temporal])
    @documento.nombre_archivo = session[:upload_progress][:nombre_archivo]
    @documento.extension_formato_archivo = @documento.nombre_archivo.split(".").last.downcase
    @documento.nombre_archivo = "archivo.#{@documento.extension_formato_archivo}"
    @documento.titulo_html = self.class.limpiar_html "#{params[:titulo]}"
    @documento.resumen_html = self.class.limpiar_html "#{params[:resumen]}"
    @documento.titulo = self.class.html2text(@documento.titulo_html)
    @documento.resumen = self.class.html2text(@documento.resumen_html)
    @documento.palabras_clave = self.class.html2text(self.class.limpiar_html("#{params[:palabras_clave]}"))
    @documento.publico=params[:acepto] if params[:acepto]
    @documento.save
    #session[:documento] = nil
    #
    File.delete(session[:upload_progress][:nombre_archivo_temporal])
    session[:upload_progress] = nil #TODO ojo pelao
    #session[:documento] = nil paso a un filtro
    #
    if ParametroGeneral.find('procesado_automatico').valor == "si"
      session[:jobkey_procesar_documento] = MiddleMan.new_worker(:class => :procesar_documento_worker, :args => @documento.id) #TODO OJO pelao
    end
    #
    if publicaciones.teg_marcar_subido(@documento.cedula_autor1, @documento.licenciatura_id) #TODO cableado
      redirect_to(:action => 'documento_cargado') #TODO OJO regresar a conest
      nuevo_mensaje "Documento cargado satisfactoriamente"
      return
    else
      self.class.eliminar(@documento.id)
      nuevo_mensaje "No se pudo establecer el estado de \'subido\' en la planilla. Comunícalo a control de estudios. El documento no ha sido cargado.", :error
      redirect_to(:action => 'documento_cargado') #TODO OJO regresar a conest
      return
    end
  end
  

  def documento_cargado
    @url_buscador = url_for(:controller => 'documento', :action => 'index')
    render(:layout => 'conest')
    return
  end
  

  def busqueda_sencilla
    if session[:busqueda].nil? or session[:busqueda].tipo != Busqueda::Sencilla
      session[:busqueda] = Busqueda.new(:tipo => Busqueda::Sencilla)
    end
    @busqueda = session[:busqueda]
  end


  def busqueda_avanzada
    if session[:busqueda].nil? or session[:busqueda].tipo != Busqueda::Avanzada
      session[:busqueda] = Busqueda.new(:tipo => Busqueda::Avanzada)
    end
    @busqueda = session[:busqueda]
  end
  
  
  def buscar_sencillo
    #obtiene las frases encerradas en comillas dobles
    frases = @busqueda.frases
    # obtiene los objetos palabras
    palabras_texto = @busqueda.palabras
    palabras = palabras_texto.collect{|pal| Palabra.find(:first, :conditions => ["texto = ?", pal]) }
    if palabras.size - palabras.nitems > 0 or palabras.size == 0
      eval cod_sin_resultado
    end
    claves_primarias_documentos =  self.class.buscar(:palabras => palabras, :frases => frases)
    session[:paginador] = Paginador.new(:claves_primarias => claves_primarias_documentos, :clase => Documento, :objetos_por_pagina => CantidadDeDocumentosPorPagina)
    redirect_to(:action => "resultado_consulta") 
    return
  end
  
  def modificar
     @d=Documento.find(params[:id])
  end

  def procesar_modificar
     d=Documento.find(params[:id])
     d.titulo=params[:titulo]
     d.titulo_html=params[:titulo]
     d.resumen=params[:resumen]
     d.save
     flash[:mensaje]="Titulo modificado"
     redirect_to :action=>'buscar_sencillo'
  end

  def buscar_avanzado
    #
    frase = params["frase"]
    palabras_texto_general = frase.palabras_normalizadas_puras
    campos_especificos_palabras = {}
    campos = ["contenido", "autor", "titulo", "resumen", "palabras_clave"]
    campos.each{ |campo|
      palabras_texto = params["#{campo}"].palabras_normalizadas_puras
      palabras_texto.uniq!
      campos_especificos_palabras[campo] = palabras_texto.collect{ |pal| Palabra.find(:first, :conditions => ["texto = ?", pal]) }
      palabras_texto_general += palabras_texto
    }
    palabras_texto_general.uniq!
    palabras = palabras_texto_general.collect{|pal| Palabra.find(:first, :conditions => ["texto = ?", pal]) }
    if palabras.size - palabras.nitems > 0
      eval cod_sin_resultado
    end
    begin
      fecha_desde = Time.mktime( *( params["fecha_desde"].split(/[^\d]+/) ).reverse ).to_i
      fecha_hasta = Time.mktime( *( params["fecha_hasta"].split(/[^\d]+/) ).reverse ).to_i
      fechas = [fecha_desde, fecha_hasta]
    rescue
      if "#{params["fecha_desde"]}#{params["fecha_hasta"]}".size > 0 # hubo fecha mal puesta
        nuevo_mensaje "Debe colocar ambas fechas correctamente, o dejarlas en blanco", :alerta
        redirect_to(:action => "busqueda_avanzada")
        return
      else
        fechas = nil
      end
    end
    # clasificacion
    campos_clasificacion = ["clasificacion_documento_academico_id"]
    clasificaciones = {}
    campos_clasificacion.each{ |cc|
      if "#{params[cc]}".size > 0
        clasificaciones[cc] = params[cc]
      end
    }
    #
    claves_primarias_documentos = self.class.buscar(:palabras => palabras, :fechas => fechas, :frases => [frase], :campos_especificos_palabras => campos_especificos_palabras, :clasificaciones => clasificaciones)
    #
    paginador = Paginador.new(:claves_primarias => claves_primarias_documentos, :clase => Documento, :objetos_por_pagina => CantidadDeDocumentosPorPagina)
    session[:paginador] = paginador
    redirect_to(:action => "resultado_consulta") 
    return
  end



  def obtener_archivo
    id_documento = params[:id]
    @documento = Documento.find(id_documento)
    if @documento.publico=="1"
      tipo_mime = "#{(self.class.formatos_mime)[@documento.formato]}"
      send_data(@documento.archivo, {:filename => "Documento_#{@documento.id}.#{@documento.formato}", :type => tipo_mime})
      return
    else
      flash[:mensaje_error]="No esta parmitido bajar este documento"
      redirect_to :action=>'busqueda_sencilla'
    end
  end


  def resultado_consulta
    if @paginador.cantidad_paginas == 0
      eval cod_sin_resultado
    end
    if @paginador.cantidad_paginas == 0
      session[:paginador] = nil
      flash[:mensaje] = "No se obtuvieron resultados para esta consulta"
      redirect_to(:action => session[:accion_busqueda])
      return
    end
    pagina = params[:id]
    @paginador.pagina_actual = pagina.to_i
    @documentos = @paginador.objetos
  end
  


  # FILTROS  FILTROS  FILTROS  FILTROS  FILTROS  FILTROS  FILTROS  FILTROS 
  
  private


  def dummy_filter
  end
  

  def pre_buscar_sencillo
    begin
      # validacion del objeto busqueda (sencilla)
      if session[:busqueda].nil? or session[:busqueda].tipo != Busqueda::Sencilla
        raise "Error intencional: el objeto busqueda en la sesion no es correcto"
      end
      @busqueda = session[:busqueda]
      @busqueda.update(params)
      # cadena vacia
      if !@busqueda.datos_validos?
        flash[:mensaje_alerta] = @busqueda.cadena_busqueda[:error]
        redirect_to(:action => "busqueda_sencilla")
        return
      end
      
#      if @busqueda.cadena_busqueda[:texto].strip == ""
      if @busqueda.busqueda_vacia?
        flash[:mensaje] = "Por favor coloque algo para saber qué tengo que buscar. Gracias"
        redirect_to(:action => "busqueda_sencilla")
        return
      end
      # bug dame todo
      if @busqueda.cadena_busqueda[:texto] == "dame todo"
        claves_primarias_documentos =  self.class.buscar_todos()
        paginador = Paginador.new(:claves_primarias => claves_primarias_documentos, :clase => Documento, :objetos_por_pagina => CantidadDeDocumentosPorPagina)
        session[:paginador] = paginador
        redirect_to(:action => "resultado_consulta")
      end
    rescue Exception => excepcion
      eval cod_post_error_imprevisto
    end
  end
  

  def pre_buscar_avanzado
    begin
      # validacion del objeto busqueda (sencilla)
      if session[:busqueda].nil? or session[:busqueda].tipo != Busqueda::Avanzada
        raise "Error intencional: el objeto busqueda en la sesion no es correcto"
      end
      @busqueda = session[:busqueda]
      @busqueda.update(params)
      if !@busqueda.datos_validos?
        flash[:mensaje_alerta] = "corrija los datos invalidos y vuelva a intentarlo"
        redirect_to(:action => "busqueda_avanzada")
        return
      end
    rescue Exception => excepcion
      eval cod_post_error_imprevisto
    end
  end
  
  
  def pre_resultado_consulta
    begin
      if session[:busqueda].nil?
        raise "Error intencional: el objeto busqueda no esta en sesion"
      end
      @busqueda = session[:busqueda]
      if session[:paginador].nil?
        raise "Error intencional: el objeto paginador no esta en sesion"
      end
      @paginador = session[:paginador]
    rescue Exception => excepcion
      eval cod_post_error_imprevisto
    end
  end
  
  
  def pre_crear
    begin
      params[:titulo].strip!
      if params[:titulo].palabras_normalizadas_brutas.size < 3
        nuevo_mensaje "EL titulo debe ser significativo", :alerta
        redirect_to :action => "llenar_titulo_resumen"
        return
      end
    rescue Exception => excepcion
      eval cod_post_error_imprevisto
    end
  end

  def post_documento_cargado
    session[:documento] = nil
  end

  
  def verificar_conest_admin
    begin
      publicaciones.ok
    rescue Exception => ee
      p ee.message
      nuevo_mensaje "No se puede establecer conexión con CONEST administracion, intente luego", :error
      #redirect_to host_conest_estudiantes + "/principal/principal"
      redirect_to :action => 'documento_cargado'
    end
  end
  
  
  def verificar_nuevo_documento_en_sesion
    begin
      @documento = session[:documento]
      if @documento.nil?
        raise "Error intencional: No existe el objeto nuevo documento"
      end
    rescue Exception => excepcion
#      puts '.:. Error imprevisto .:.', excepcion, excepcion.backtrace
#      nuevo_mensaje "Ocurrió un error en la carga del documento, asegúrese de interactuar segun la interfaz", :error
#      redirect_to :action => 'documento_cargado'
      eval cod_post_error_imprevisto_carga_documento
    end
  end
  

  def pre_llenar_titulo_resumen
    begin
      session[:upload_progress][:nombre_archivo_temporal]
      # que exista el archivo
    rescue Exception => excepcion
      eval cod_post_error_imprevisto_carga_documento
    end
  end


end











