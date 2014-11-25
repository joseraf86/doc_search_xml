
class Busqueda
  # para los campos se tiene un hash {:texto, :palabras, :error}
  Sencilla = "sencilla"
  Avanzada = "avanzada"
  attr_accessor :tipo
  attr_accessor :datos_validos # con metodo datos_validos?
  alias datos_validos? datos_validos
  attr_accessor :palabras #string
  attr_accessor :frases #arreglo de string
  # simple
  attr_accessor :cadena_busqueda
  # avanzada
  attr_accessor :contenido
  attr_accessor :autor
  attr_accessor :titulo
  attr_accessor :resumen
  attr_accessor :palabras_clave
  attr_accessor :frase
  attr_accessor :fecha_desde
  attr_accessor :fecha_hasta
  
  def initialize(args)
    super()
    @tipo = args[:tipo]
    if @tipo == Sencilla
      @cadena_busqueda = {:texto => ""}
    elsif tipo == Avanzada
      @contenido = {:texto => ""}
      @autor = {:texto => ""}
      @titulo = {:texto => ""}
      @resumen = {:texto => ""}
      @palabras_clave = {:texto => ""}
      @frase = {:texto => ""}
      @fecha_desde = {:texto => ""}
      @fecha_hasta = {:texto => ""}
    end
  end
  
  def update(params)
    
    if @tipo == Sencilla
      errores = []
      @cadena_busqueda[:texto] = params[:cadena_busqueda]
      @frases = @cadena_busqueda[:texto].extraer!(/["][^"]*["]/).uniq
      @frases.each_with_index{ |f, i|
        f.delete!("\"")
        f.normalizar!
        errores << "error en frase #{i+1}" if f.tiene_signos?
      }
      @frases.delete_if{|f| f.size==0}
      @cadena_busqueda[:texto].normalizar!
      errores.unshift "error en la cadena de busqueda" if @cadena_busqueda[:texto].tiene_signos?
      @cadena_busqueda[:texto] += (frases.collect{|f| " \"#{f}\""}.join)
      @cadena_busqueda[:texto].strip!
      @palabras = @cadena_busqueda[:texto].palabras_normalizadas_puras.uniq
      if errores.size > 0
        @datos_validos = false
        @cadena_busqueda[:error] = errores.join(", ")
      else
        @datos_validos = true
        @cadena_busqueda[:error] = nil
      end

    elsif @tipo == Avanzada

      @datos_validos = true
      data = ["contenido", "frase", "autor", "titulo", "resumen", "palabras_clave"]
      data.each{ |campo|
        errores = []
        texto_campo = params[campo].normalizar!
        
        if texto_campo.tiene_signos?
          @datos_validos = false
          errores << "solo colocar letras, sin signos ni numeros"
        end
        self.send(campo)[:error] = errores.join(", ")
        self.send(campo)[:texto] = texto_campo
        self.send(campo)[:advertencia] = ""
      }

    end

  end
  
  
  def info
    retorno = ""
    if @tipo == Avanzada
      data = ["contenido", "frase", "autor", "titulo", "resumen", "palabras_clave" ]
      data.each{ |campo|
        retorno += "En #{campo[0,22]}" + ": #{self.send(campo)[:texto]}. " if self.send(campo)[:texto].to_s.size > 0
      }
    end
    return retorno
  end
  
  
  def busqueda_vacia?
    if @tipo == Sencilla
      return true if @cadena_busqueda[:texto].strip.gsub(/\s+/," ") == ""
    elsif @tipo == Avanzada
      
    end
    
    return false
  end


  
  
  def todas_las_palabras_estan_en_el_sistema
  end



end
