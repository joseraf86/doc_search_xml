require RAILS_ROOT + '/app/controllers/application'

class ProcesarDocumentosWorker < BackgrounDRb::Rails
  

  attr_accessor :status, :progreso, :total, :finalizado

  def do_work(args = nil)
    
    begin
      #
      @progreso = 0; @status = "Iniciando el procesamiento de los documentos cargados"
      ApplicationController.procesar_no_procesados(self)
      #
      @finalizado = true
      MiddleMan.delete_worker(@_job_key) # fino!
      ActiveRecord::Base.connection.disconnect!
    rescue Exception => e
      puts e.inspect, e.backtrace
    end
  end
  
  def parametros
    return @total, @progreso, @status, @finalizado
  end

end
