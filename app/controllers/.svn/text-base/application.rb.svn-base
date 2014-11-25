class ApplicationController < ActionController::Base

  Nombre = "Buscador de Trabajos Digitales. Facultad de Ciencias. UCV"
  # Pick a unique cookie name to distinguish our session data from others'
  session :session_key => '_app_tesis_session_id'
  
  before_filter :inicializar_mensajes
  
  FormulaPesoNumericoPalabras = "SUM(ln(1 + frecuencia_en_contenido + 4*frecuencia_en_titulo + 4*frecuencia_en_resumen + 4*frecuencia_en_palabras_clave))"
  
  # peso_numerico1 es la fecha de publicacion en timestamp (int)
  # peso_numerico2 es la valoracion del autor-documento = (eficiencia * promedio_general * nota * (1.2 [si premio] )
  def self.formula_ordenamiento_sql
    "POW((1 - #{FormulaPesoNumericoPalabras}/ #{@maximo_peso_numerico_palabras}),2) " + " + " + "POW((1 - peso_numerico2/#{@maximo_peso_numerico2}), 2) "
  end




  # MODULO DE CARGA  MODULO DE CARGA  MODULO DE CARGA  MODULO DE CARGA  MODULO DE CARGA  MODULO DE CARGA




  def self.almacenar_estructuras(documento, worker = nil)
    documento_igual = Documento.find(:first, :conditions => ["procesado AND md5 = ? ", documento.md5])
    if documento_igual
      fusionar_autores(documento_igual, documento)
      worker.status = "Fusionando con documento ya existente" if worker # WORKER!
      return
    end
    # pesos numericos estaticos
    documento.peso_numerico1 = Time.mktime *documento.fecha.scan(/[\d]+/).reverse
    documento.peso_numerico2 = documento.eficiencia.to_f * documento.promedio_ponderado.to_f * documento.nota.to_f
    documento.peso_numerico2 *= 1.2 if documento.tiene_premio == "si"
    # obtencion de texto y palabras
    texto_contenido = obtener_texto(documento).normalizar!
    documento.texto = texto_contenido
    palabras_contenido = texto_contenido.palabras_normalizadas_puras
    worker.status = "cantidad de palabras: #{palabras_contenido}" if worker # WORKER!
    # prosesamiento de frecuencias y tablas externas al documento
    tfs_contenido = obtener_frecuencias(palabras_contenido, worker)  # WORKER!
    #archivo_frecuencias = File.open("tmp/frecuencias de #{documento.titulo}.txt","w")
    #tfs_contenido.each{|tf|archivo_frecuencias.puts "#{tf[1]} #{tf[0]}"}
    #archivo_frecuencias.close
    tfs_titulo = obtener_frecuencias( documento.titulo.palabras_normalizadas_puras )
    tfs_palabras_clave = obtener_frecuencias(documento.palabras_clave.palabras_normalizadas_puras)
    tfs_resumen = obtener_frecuencias(documento.resumen.palabras_normalizadas_puras)
    tfs_autor = obtener_frecuencias(documento.autor.palabras_normalizadas_puras)
    # sera un hash de hashes  { palabra => { tipo_frecuencia => valor1, ... }, ...    } 
    worker.status = "Finalizado el calculo de frecuencias" if worker # WORKER!
    tfs = {}
    tfs_contenido.each{|tf|
      tfs[tf[0]]= { "frecuencia_en_contenido" => tf[1] }
    }
    tfs_titulo.each{|tf|
      if tfs[tf[0]]
        tfs[tf[0]]["frecuencia_en_titulo"] = tf[1]
      else
        tfs[tf[0]]= { "frecuencia_en_titulo" => tf[1] }
      end
    }
    tfs_palabras_clave.each{|tf|
      if tfs[tf[0]]
        tfs[tf[0]]["frecuencia_en_palabras_clave"] = tf[1]
      else
        tfs[tf[0]]= { "frecuencia_en_palabras_clave" => tf[1] }
      end
    }
    tfs_resumen.each{|tf|
      if tfs[tf[0]]
        tfs[tf[0]]["frecuencia_en_resumen"] = tf[1]
      else
        tfs[tf[0]]= { "frecuencia_en_resumen" => tf[1] }
      end
    }
    tfs_autor.each{|tf|
      if tfs[tf[0]]
        tfs[tf[0]]["frecuencia_en_autor"] = tf[1]
      else
        tfs[tf[0]]= { "frecuencia_en_autor" => tf[1] }
      end
    }
    # procesamiento general de todas las frecuencias
    worker.status = "Almacenando estructuras auxiliares" if worker # WORKER!
    tfs.each{ |tf|
      palabra = Palabra.find(:first, :conditions => ["texto = ?", tf[0] ] )
      if palabra.nil?
        palabra = Palabra.new
        palabra.texto = tf[0]
        palabra.save
        worker.status = "Nueva palabra: \'#{palabra.texto}\'" if worker # WORKER!
      end
      insertar_documento_palabra(documento, palabra, tf[1])
      worker.status = "Asociando \'#{palabra.texto}\'" if worker # WORKER!
    }
    # finalizacion del procesamiento
    documento.procesado = true
    begin
    documento.save
    rescue
      puts "Error procesando"
    end
  end
  

  def self.insertar_documento_palabra(documento, palabra, htf)
    sql =  "INSERT INTO documento_palabra "
    sql += "(documento_id, palabra_id, frecuencia_en_contenido, frecuencia_en_titulo, frecuencia_en_palabras_clave, frecuencia_en_resumen, frecuencia_en_autor) "
    sql += "VALUES "
    sql += "(#{documento.id}, #{palabra.id}, #{htf['frecuencia_en_contenido'].to_i}, #{htf['frecuencia_en_titulo'].to_i}, #{htf['frecuencia_en_palabras_clave'].to_i}, #{htf['frecuencia_en_resumen'].to_i}, #{htf['frecuencia_en_autor'].to_i}) "
    ejecutar_sql(sql)
  end


  
  
  
  def self.obtener_texto(documento)
    #recibe al objeto documento con archivo y metadata seteados
    if (documento.extension_formato_archivo == "pdf")
      base = rand
      nombre_archivo_binario = "./tmp/#{base}.pdf"
      nombre_archivo_texto = "./tmp/#{base}.pdf.txt"
      archivo_binario = File.open("#{nombre_archivo_binario}","wb"){|f|f.write documento.archivo }
      system("pdftotext #{nombre_archivo_binario} #{nombre_archivo_texto}")
      archivo_texto = File.new("#{nombre_archivo_texto}","r")
      retorno = archivo_texto.read
      system("rm #{nombre_archivo_texto}")
      system("rm #{nombre_archivo_binario}")
    elsif (documento.extension_formato_archivo == "doc")
#      nombre_archivo_binario = "./tmp/#{documento.nombre_archivo}".gsub(/[\s]+/,"_")
#      nombre_archivo_texto = "./tmp/#{documento.nombre_archivo}.txt".gsub(/[\s]+/,"_")
      base = rand
      nombre_archivo_binario = "./tmp/#{base}.pdf"
      nombre_archivo_texto = "./tmp/#{base}.pdf.txt"
      archivo_binario = File.open("#{nombre_archivo_binario}","wb"){|f|f.write documento.archivo }
      system("antiword #{nombre_archivo_binario} > #{nombre_archivo_texto}")
      archivo_texto = File.new("#{nombre_archivo_texto}","r")
      retorno = archivo_texto.read
      system("rm #{nombre_archivo_texto}")
      system("rm #{nombre_archivo_binario}")
    elsif (documento.extension_formato_archivo == "txt")
      retorno = documento.archivo
    else
      puts "ADVERTENCIA: Tipo de archivo no soportado o sin extension, se devolvio una cadena vacia"
      retorno = ""
    end
    return retorno
  end
  

  
  def self.obtener_frecuencias(palabras, worker = nil) # recibe un arreglo de palabras de un texto, y  devuelve un hash { "palabra" => frecuencia } que indica las repeticiones de cada palabra distinta
    tf = {}
    palabras_unicas = palabras.uniq
    palabras_unicas.each{ |palabra_unica|
      if Palabra.omitidas.include? palabra_unica
        tf[palabra_unica] =  1
      else
        tf[palabra_unica] =  palabras.find_all{ |pal| pal == palabra_unica }.size
      end
        worker.status = "Palabra \'#{palabra_unica}\' aparece #{tf[palabra_unica]} veces. " if worker # WORKER!
        puts " #{palabra_unica} #{tf[palabra_unica]}" #para ver que todo esta saliendo bien
      palabras.delete_if{ |pal| pal == palabra_unica} #Elimina la palabra para reducir el arreglo de palabras
    }
    return tf
  end


  def self.fusionar_autores(documento_anterior, documento_nuevo)
    # actualizar estructuras que referencian al autor
    tfs_nuevo_autor = obtener_frecuencias(documento_nuevo.autor.palabras_normalizadas_puras)
    tfs_nuevo_autor.each_pair{ |palabra_texto, frecuencia|
      palabra = Palabra.find(:first, :conditions => ["texto = ?", palabra_texto])
      if palabra
        rs = ejecutar_sql("SELECT * FROM documento_palabra WHERE documento_id = #{documento_anterior.id} AND palabra_id = #{palabra.id}")
        if rs.num_rows == 1
          ejecutar_sql("UPDATE documento_palabra SET frecuencia_en_autor = 1 WHERE documento_id = #{documento_anterior.id} AND palabra_id = #{palabra.id}")
        else
          ejecutar_sql("INSERT INTO documento_palabra (frecuencia_en_autor) VALUES (1)")
        end
      else
        palabra = Palabra.new
        palabra.texto = palabra_texto
        palabra.save
        ejecutar_sql("INSERT INTO documento_palabra (documento_id, palabra_id, frecuencia_en_autor) VALUES (#{documento_anterior.id}, #{palabra.id}, 1)")
      end
    }
    # xml con el nuevo autor
    xml = documento_anterior.xml
    xml_autor = REXML::Element.new "autor"
    xml.root.add xml_autor
    campos_autor = [:nombre, :cedula, :correo, :telefonos, :promedio_general, :promedio_ponderado, :eficiencia]
    campos_autor.each{|campo|
      elem = xml_autor.add_element campo.to_s
      elem.text = documento_nuevo.send("#{campo.to_s + "_autor1"}")
    }
    documento_anterior.metadata = xml.to_s
    # actualizacion del peso academico
    documento_anterior.peso_numerico2 = documento_anterior.eficiencia.to_f * documento_anterior.promedio_ponderado.to_f * documento_anterior.nota.to_f
    documento_anterior.peso_numerico2 *= 1.2 if documento_anterior.tiene_premio == "si"
    # finalizacion
    documento_anterior.save
    documento_nuevo.destroy
  end



  
  # MODULO DE BUSQUEDA  MODULO DE BUSQUEDA  MODULO DE BUSQUEDA  MODULO DE BUSQUEDA  MODULO DE BUSQUEDA 




  def self.buscar_todos()
    rs = ejecutar_sql("SELECT id FROM documento")
    claves_primarias = []
    rs.each{|row| claves_primarias << row[0] }
    return claves_primarias
  end


  def self.buscar_no_procesados()
    rs = ejecutar_sql("SELECT id FROM documento where NOT procesado")
    claves_primarias = []
    rs.each{|row| claves_primarias << row[0] }
    return claves_primarias
  end


  def self.buscar(args)
    palabras = args[:palabras] # objetos palabra
    fechas = args[:fechas] # en timestamp
    frases = args[:frases] # texto simple sin las comillas
    campos_especificos_palabras = args[:campos_especificos_palabras] # hash con el campo como clave y su arreglo de palabras objeto como valor
    clasificaciones = args[:clasificaciones]
    #
    #session[:paginador] = nil #TODO  y ahora que se hace !!, quizas con filtros y cosas de esas
    establecer_maximos(:cantidad_palabras => palabras.size)
    #
    palabras_id = palabras.collect{|pal| pal.id}
    if palabras_id.size > 0
      sql_palabras_where = "AND palabra_id IN (#{palabras_id.join(', ')}) "
    else
      sql_palabras_where = " "
    end
    if fechas
      sql_fechas_where = "AND peso_numerico1 BETWEEN #{fechas[0]} AND #{fechas[1]} "
    else
      sql_fechas_where = ""
    end
    if frases or frases.size > 0
      frases.delete_if{|f|f.gsub(/[\s]+/,"").size < 1}
      sql_frases_where = frases.collect{|frase| "AND metadata LIKE '%#{frase}%' "}.join(" ")
    else
      sql_frases_where = ""
    end
    if !campos_especificos_palabras # si es busqueda sencilla
      sql_palabras_having = "AND COUNT(*) = #{palabras_id.size} "
    else
      sql_palabras_having = ""
      campos_especificos_palabras.each{ |cp|
        if cp[1].size > 0
            #puts cp[0]
          sql_palabras_having += "AND SUM( frecuencia_en_#{cp[0]} > 0 AND palabra_id IN ( #{cp[1].collect{|p|p.id}.join(', ') }) ) = #{cp[1].size} "
        else
        end
      }
    end
    # clasificacion
    sql_clasificaciones = ""
    if clasificaciones
      clasificaciones.each_pair{ |clave, valor|
        sql_clasificaciones += "AND #{clave} = #{valor} "
      }
    end
    #
    sql =  "SELECT documento_id, #{formula_ordenamiento_sql} AS campo_ordenamiento "
    sql += "FROM documento_palabra, documento "
    sql += "WHERE true "
    sql += sql_palabras_where
    sql += sql_fechas_where
    sql += sql_clasificaciones
    sql += "AND documento_id = documento.id "
    sql += sql_frases_where
    sql += "GROUP BY documento_id "
    sql += "HAVING true "
    sql += sql_palabras_having
    sql += "ORDER BY campo_ordenamiento "
    #puts ("SQL buscar() >>>  " + sql)
    rs = ejecutar_sql(sql)
    claves_primarias = []
    rs.each{|row|
      claves_primarias << row[0]
      #puts "** El documento #{row[0]} dista del óptimo en #{row[1]}"
    }
    return claves_primarias
  end
  

  def self.establecer_maximos(args)
    @maximo_peso_numerico1 = valor_sql("SELECT MAX(peso_numerico1) FROM documento")
    @maximo_peso_numerico2 = 1 * 20 * 20 * 1.2
    maximo_frecuencia_en_contenido = valor_sql("SELECT MAX( frecuencia_en_contenido ) FROM documento_palabra")
    @maximo_peso_numerico_palabras = (args[:cantidad_palabras].to_i() + 1 )* Math.log(12*maximo_frecuencia_en_contenido.to_f + 0.001)
  end

  
  

  # FUNCIONES ADMINISTRATIVAS    FUNCIONES ADMINISTRATIVAS    FUNCIONES ADMINISTRATIVAS    FUNCIONES ADMINISTRATIVAS




  def self.procesar_no_procesados(worker = nil)
    claves_primarias = buscar_no_procesados
    worker.total = claves_primarias.size if worker # WORKER!
    claves_primarias.each_with_index{|clave_primaria_documento, i|
      ejecutar_sql("DELETE FROM documento_palabra WHERE documento_id = #{clave_primaria_documento}")
      worker.progreso = i+1 if worker # WORKER!
      worker.status = "Comenzando ..." if worker # WORKER!
      begin
      almacenar_estructuras(Documento.find(clave_primaria_documento), worker) # WORKER!
      rescue
        puts "se cayo"
      end
    }
  end
  
    
  def self.eliminar(id)
    ejecutar_sql("DELETE FROM documento_palabra WHERE documento_id = #{id}")
    ejecutar_sql("DELETE FROM documento WHERE id = #{id}")
    # las palabras pueden quedarse
  end
  

  def self.eliminar_todo
    ejecutar_sql("DELETE FROM documento_palabra")
    ejecutar_sql("DELETE FROM documento")
    ejecutar_sql("DELETE FROM palabra")
  end
  
  def self.desprocesar_todo
    ejecutar_sql("DELETE FROM documento_palabra")
    ejecutar_sql("DELETE FROM palabra")
    ejecutar_sql("UPDATE documento SET procesado = false")
    return
  end

  
  
  
  
  # OTROS UTILES
  
  def self.formatos_mime # formato => mime
    h = {"doc" => "application/msword", "pdf" => "application/pdf", "txt" => "text/plain"}
    h.default = "application/octet-stream"
    return h
  end
  
  def self.ejecutar_sql(sql)
    begin
    return ActiveRecord::Base.connection.execute(sql)
    rescue
    end
  end
  
  def self.valor_sql(sql) #cuando se quiere un solo valor del SQL
    fr = ejecutar_sql(sql).fetch_row
    return fr.first if fr
  end
  
  

  def inicializar_mensajes
    flash[:mensaje_error] = "" if flash[:mensaje_error].class != String
    flash[:mensaje_alerta] = "" if flash[:mensaje_alerta].class != String
    flash[:mensaje] = "" if flash[:mensaje].class != String
  end
  
  def borrar_mensajes
    flash[:mensaje_error] = ""
    flash[:mensaje_alerta] = ""
    flash[:mensaje] = ""
  end
  
  def nuevo_mensaje(texto, tipo = nil)
    return if texto.to_s.strip == 0
    str_simbol = "mensaje"
    str_simbol += "_alerta" if tipo == :alerta
    str_simbol += "_error" if tipo == :error
    anterior = flash[:"#{str_simbol}"]
    if anterior.class == String and anterior.size > 0
      flash[:"#{str_simbol}"] = anterior + ". " + texto.strip
    else
      flash[:"#{str_simbol}"] = texto.strip
    end
  end
  
  

  CadenaTraduccionA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  CadenaTraduccionB = "6VjTt8uIOFw7az21HKqQPl3CYoih0AMnefbcsGWLmxRp9kvdNBZXrDSEy4JU5g"
  
  
  parametros_generales = ["host_conest_estudiantes", "host_conest_admin"]
  parametros_generales.each{ |parametro|
    define_method(parametro){
      return ParametroGeneral.find(parametro).valor
    }
  }
  

  def self.html2text(html)
    archivo_html = "tmp/" + rand.to_s + ".html"
    archivo_texto = "tmp/" + rand.to_s + ".txt"
    File.open("#{archivo_html}","wb"){|f| f.write html}
    system("html2text #{archivo_html} > #{archivo_texto}")
    salida = File.open("#{archivo_texto}").read
    salida = salida.gsub(Regexp.new("_\b[\w]\b"),"")
    salida = salida.gsub(Regexp.new("[A-z]\b"),"")
    salida = salida.gsub(Regexp.new("\b"),"")
    salida = salida.split.join(" ")
    system("rm #{archivo_html} #{archivo_texto}")
    salida = Iconv.new('UTF-8', 'latin1').iconv(salida)
    return salida
  end

  
  def self.limpiar_html(x)
  	validos = %w{ <sub> </sub> <sup> </sup> <em> </em> <strong>  </strong> }
  	y, inicio, en_etiqueta = [], 0, false
  	x.size.times{ |ca|
  		actual=x[ca..ca]
  		if en_etiqueta
  			if actual==">"
  				y << x[inicio..(ca)] if validos.include? x[inicio..(ca)]
  				inicio, en_etiqueta = ca+1, false
  			end			
  		else
  			if actual == "<"
  				y << x[inicio..(ca - 1)] if ca > 0
  				inicio, en_etiqueta = ca, true 
  			end
  			y << x[inicio..(ca)] if ca == x.size - 1
  		end
  	}
  	y.join
  end
  

  def self.md5sum(nombre_archivo)
    nfsalida = rand.to_s + ".txt"
    system("md5sum #{nombre_archivo} > #{nfsalida}")
    md5 = File.open(nfsalida, "r").read.split.first
    system("rm #{nfsalida}")
    return md5
  end
  
  def self.establecer_clasificacion_documento_academico(documento)
    tipos_formatos_id = {"pdf" => 0, "doc" => 0, "txt" => 0}
  end


end




=begin


d = Documento.find_first
ApplicationController.html2text(d.titulo)


  def self.almacenar_palabras_frecuencias(tfs)
    tfs.each{ |tf|
      texto_palabra = tf[0]
      palabra = Palabra.find(:first, :conditions => ["texto = ?", texto_palabra] )
      if palabra
      else
        palabra = Palabra.new
        palabra.texto = texto_palabra
        palabra.save
      end
    }
  end



=end

