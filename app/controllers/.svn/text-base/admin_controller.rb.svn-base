class AdminController < ApplicationController

  AccionPrincipal = "index"
  
  verify :session => :administrador, :except => [:login, :index, :iniciar_sesion] , :add_flash => {:mensaje_error => "debes logearte como administrador"}, :redirect_to => { :action => "login" }

  def index
    if session[:administrador]
      redirect_to :action => "admin"
    else
      redirect_to :action => "login"
    end
  end


  def iniciar_sesion
    if ParametroGeneral.find('login_administrador').valor == params[:login] and ParametroGeneral.find('password_administrador').valor == params[:password]
      session[:administrador] = true
      if params[:conest_admin]
        session[:conest_admin] = true
        #
        session[:usuario] = {:nombre_estandar => params[:nombre_estandar], :roles_estandar => params[:roles_estandar]}
        session[:licenciatura] = {:nombre_corto => params[:nombre_corto]}
        session[:parametros_generales] = {:grado_periodo_lectivo => params[:grado_periodo_lectivo], :grado_ano_lectivo => params[:grado_ano_lectivo]}
        session[:periodo_academico_actual] = {:nombre_periodo => params[:nombre_periodo]}
      end
      redirect_to :action => "admin"
      return
    else
      session[:administrador] = nil
      session[:conest_admin] = nil # ojo pelao
      nuevo_mensaje("Datos incorrectos :S", :error)
      redirect_to :action => "login"
      return
    end
  end
  
  def login
  end


  def admin
    @procesado_automatico = ParametroGeneral.find('procesado_automatico').valor
    @host_conest_admin = ParametroGeneral.find('host_conest_admin').valor
    @host_conest_estudiantes = ParametroGeneral.find('host_conest_estudiantes').valor
    if session[:conest_admin] # TODO OJO pelao
      render :layout => "conest_admin"
    end
  end
  

  # MONITOREO
  #def lanzar_procesar_documento(id) # se hace automaticamente, no guiado por el administrador aun
  #  session[:jobkey_procesar_documento] = MiddleMan.new_worker :class => :procesar_documento_worker, :args => id
  #end
  
  
  def status_procesar_documentos_dinamico
    @worker = MiddleMan.get_worker(session[:jobkey_procesar_documentos])
    if @worker
      @total, @progreso, @status, @finalizado = @worker.parametros
      if @finalizado
        session[:jobkey_procesar_documentos] = nil
      end
    else
      session[:jobkey_procesar_documentos] = nil
      #@status = "No hay proceso de lote de documentos actualmente"
      @status = ""
    end
  end


  def status_procesar_documento_dinamico
    @worker = MiddleMan.get_worker(session[:jobkey_procesar_documento])
    if @worker
      @total, @progreso, @status, @finalizado = @worker.parametros
      if @finalizado
        session[:jobkey_procesar_documento] = nil
      end
    else
      session[:jobkey_procesar_documento] = nil
      #@status = "No hay proceso de documento actualmente"
      @status = ""
    end
  end



  # FUNCIONES DEL ADMINISTRADOR


  
  def cerrar_sesion
    session[:administrador] = nil
    nuevo_mensaje("Sesión del administrador finalizada")
    redirect_to :controller => "documento", :action => DocumentoController::AccionPrincipal
    return
  end
  

  def actualizar_parametros
    mensajes = ["sistema actualizado"]
    pgpa = ParametroGeneral.find(:procesado_automatico.to_s); pgpa.valor = params[:procesado_automatico]; pgpa.save
    pgpa = ParametroGeneral.find(:host_conest_admin.to_s); pgpa.valor = params[:host_conest_admin]; pgpa.save
    pgpa = ParametroGeneral.find(:host_conest_estudiantes.to_s); pgpa.valor = params[:host_conest_estudiantes]; pgpa.save
    flash[:mensaje] = mensajes.join ", "
    redirect_to :action => 'admin'
    return
  end
  
  
  def desprocesar_todo
    self.class.desprocesar_todo
    #flash[:mensaje] = "Se desprocesaron todos los documentos!"
    nuevo_mensaje ("Se desprocesaron todos los documentos!")
    eval cod_post_comando_administrador
  end


  def procesar_no_procesados #con worker
    #self.class.procesar_no_procesados
    session[:jobkey_procesar_documentos] = MiddleMan.new_worker :class => :procesar_documentos_worker, :args => nil
    nuevo_mensaje "Se envió la orden de procesar los documentos."
    eval cod_post_comando_administrador
  end
  

  def eliminar
    id = params[:id]
    self.class.eliminar(id)
    flash[:mensaje] = "Se elimino al documento #{id}"
    eval cod_post_comando_administrador
  end
  
  
  def eliminar_todo
    self.class.eliminar_todo
    #flash[:mensaje] = "No quedó lo que se llama nada!"
    nuevo_mensaje "No quedó lo que se llama nada!"
    eval cod_post_comando_administrador
  end

  

  
  # PEDAZOS DE CODIGO

  def cod_post_error_imprevisto
    %q/
    # para llamar a este codigo debe existir la variable excepcion
    puts '.:. Error imprevisto .:.', excepcion, excepcion.backtrace
    flash[:mensaje_error] = 'Error improvisto del sistema'
    redirect_to(:action => AccionPrincipal)
    return
    /
  end


  def cod_post_comando_administrador
    %q/
    redirect_to(:action => "admin")
    return
    /
  end



#  def verificar_conest_admin
#  end


end

