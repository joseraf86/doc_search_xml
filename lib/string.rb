class String


  CaracterSigno = "#" #      #{CaracterSigno}


  def normalizar!
    self.gsub!(/[\s]+/, " ")
    self.cambiar_acentos!
    self.cambiar_enes!
    self.downcase!
    self.gsub!(/[^a-z\s]+/,CaracterSigno)
    self.strip!
    @normalizado = true
    return self
  end


#  def normalizado
#    self.clone.normalizar!
#  end


  def cambiar_acentos!
    self.gsub!("\303\241".to_s,"a")
    self.gsub!("\303\251".to_s,"e")
    self.gsub!("\303\255".to_s,"i")
    self.gsub!("\303\263".to_s,"o")
    self.gsub!("\303\272".to_s,"u")
    self.gsub!("\303\201".to_s,"A")
    self.gsub!("\303\211".to_s,"E")
    self.gsub!("\303\215".to_s,"I")
    self.gsub!("\303\223".to_s,"O")
    self.gsub!("\303\232".to_s,"U")
    #pdftotext
    cadena_reemplazo = ""
    self.each_byte{ |b|
      caracter_reemplazo = b
      caracter_reemplazo = "a" if (b == 225 or b == 193) #cambia la a acentuada
      caracter_reemplazo = "e" if (b == 233 or b == 201) #cambia la e acentuada
      caracter_reemplazo = "i" if (b == 237 or b == 205) #cambia la i acentuada
      caracter_reemplazo = "o" if (b == 243 or b == 211) #cambia la o acentuada
      caracter_reemplazo = "u" if (b == 250 or b == 218) #cambia la u acentuada
      cadena_reemplazo << caracter_reemplazo
    }
    self.replace(cadena_reemplazo)
    return self
  end
  

  def cambiar_enes!
    self.gsub!("\303\261".to_s,"n")
    self.gsub!("\303\221".to_s,"N")
    #pdftotext
    cadena_reemplazo = ""
    self.each_byte{ |b|
      caracter_reemplazo = b
      caracter_reemplazo = "n" if (b == 177 or b == 145) #cambia la ñ y Ñ =>  n
      cadena_reemplazo << caracter_reemplazo
    }
    self.replace(cadena_reemplazo)
    return self
  end
  

  def extraer!(patron, sustitucion = "")
    coincidencias = self.scan(patron)
    coincidencias.each{ |subcadena|
      self.gsub!(subcadena, sustitucion)
    }
    return coincidencias
  end
  
  
  def palabras_normalizadas_puras #    "Código: Clase.mi_atributo #ejemplo." => ["codigo", "ejemplo"]
    if @normalizado
      cadena = self
    else
      cadena = self.clone
      cadena.normalizar!
    end
    words = " #{cadena} ".split /[#{CaracterSigno}]*[\s]+[#{CaracterSigno}]*/
    words.delete_if{ |word| word.match(/[^a-z]+/) or word.size == 0 }
    
    return words
  end
  
  
  def palabras_normalizadas_brutas #    "Código: Clase.mi_atributo #ejemplo." => ["codigo", "clase", "mi", "atributo", "ejemplo"]
    if @normalizado
      cadena = self
    else
      cadena = self.clone
      cadena.normalizar!
    end
    words = cadena.split /[\s#{CaracterSigno}]+/
  end
  

  def tiene_signos?
    if @normalizado
      cadena = self
    else
      cadena = self.clone
      cadena.normalizar!
    end
    return self.match(/[#{CaracterSigno}]+/)
  end

  def html_unescaped
    cadena=self
    cadena=cadena.gsub("&amp;","&");
    cadena=cadena.gsub("&lt;","<");
    cadena=cadena.gsub("&gt;",">");
  end  

end


