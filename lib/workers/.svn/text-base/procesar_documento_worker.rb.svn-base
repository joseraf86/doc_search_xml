require RAILS_ROOT + '/app/controllers/application'

class ProcesarDocumentoWorker < BackgrounDRb::Rails


  attr_accessor :status, :progreso, :total, :finalizado

  def do_work(documento_id)
    
    begin
      texto = "Iniciando el proceso del documento (id: #{documento_id})"
      @total = 1; @progreso = 0; @status = texto
      puts texto
      documento = Documento.find(:first, :conditions => ["id = ?", documento_id])
      ApplicationController.almacenar_estructuras(documento, self)
      #
      @progreso = 1
      @finalizado = true
      MiddleMan.delete_worker(@_job_key) # fino!
      ActiveRecord::Base.connection.disconnect!
    rescue Exception => e
      puts e.message
      puts e.backtrace
    end
  end
  
  def parametros
    return @total, @progreso, @status, @finalizado
  end

end
