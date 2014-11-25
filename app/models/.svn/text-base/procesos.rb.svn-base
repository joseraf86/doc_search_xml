require 'yaml'
class Procesos
  def self.obtener_entregas
      Documento.find(:all).each{|d|
            print "#{d.licenciatura}, #{d.autor}\n"
      }
  end
 def self.limpiar_string(x)
    validos=%w{ <sub> </sub> <sup> </sup> <em> </em> <strong>  </strong> }
    y,inicio,en_etiqueta=[],0,false
    x.size.times{ |ca|
      actual=x[ca..ca]
      if en_etiqueta
        if actual == ">"
          y << x[inicio..(ca)] if validos.include? x[inicio..(ca)]
          inicio,en_etiqueta=ca+1,false
        end
      else
        if actual=="<"
          y << x[inicio..(ca-1)] if ca>0
          inicio,en_etiqueta=ca,true
        end
        y << x[inicio..(ca)] if ca==x.size-1
      end
    }
    y.join
  end
  
  def self.limpiar_titulos
    Documento.find(:all).each{ |d|
      titulo_limpio=self.limpiar_string(d.titulo)
      print d.titulo
      print "\n\n"
      print titulo_limpio
      print "\n\n\n"
      #d.titulo=titulo_limpio
      #      #d.save
    }
  end

  def self.arreglar_titulo(t)
    t.gsub!("&AACUTE;","&Aacute;")
    t.gsub!("&EACUTE;","&Eacute;")
    t.gsub!("&IACUTE;","&Iacute;")
    t.gsub!("&OACUTE;","&Oacute;")
    t.gsub!("&UACUTE;","&Uacute;")
    t.gsub!("&NBSP;","")
    t
  end

  def self.obtener_titulos
    arreglo = []
    Documento.find(:all).each{ |d|
      3.times{|t|
        cedula=d.send("cedula_autor#{(t+1)}")
        if cedula && cedula.strip!=""
          registro={} 
	  registro[:titulo] = self.arreglar_titulo(d.titulo_html.strip.upcase)
          registro[:cedula] = cedula 
          registro[:licenciatura_id] = d.licenciatura_id 
	  arreglo << registro
	end
      }
    }
    File.open("#{RAILS_ROOT}/titulos.yml","w") { |f| f.write(arreglo.to_yaml) }

  end

end
