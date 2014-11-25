class FilesController < ApplicationController

  #funciona con un hash
  #session[:upload_progress] = { :controlador, :accion, :data }


  session :off, :only => :progress
  

  def progress
    render :update do |page|
      @status = Mongrel::Uploads.check(params[:upload_id])
      page.upload_progress.update(@status[:size], @status[:received]) if @status
    end
  end
  
  alias upload_progress progress
  
  
  def upload
    url = url_for(:controller => session[:upload_progress][:controlador], :action => session[:upload_progress][:accion])
    session[:upload_progress][:nombre_archivo_temporal] = "./tmp/#{params["upload_id"]}.bin"
    session[:upload_progress][:nombre_archivo] = params[:data].original_filename
    File.open(session[:upload_progress][:nombre_archivo_temporal], "wb"){ |f|
      f.write params[:data].read
    }
    render :text => "<script>window.parent.location='#{url}'</script>" # genera salida html con un redirect
    #render_text "subido: " + params[:data].original_filename
  end


end

