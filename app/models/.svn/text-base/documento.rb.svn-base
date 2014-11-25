class Documento < ActiveRecord::Base

  # la Clase consiste esencialmente de: 
  # - Archivo binario
  # - Metadata 
  # 
  # La metadata es una abstracion almacaneda a travez de un XML
  # pero de la que se obtienen una serie de metodos  como titulo, etc
  # 

  belongs_to :clasificacion_documento_academico
  
  CantidadMaximaAutores = 3 # mas de 3 es una aberracion
  
  def initialize
    super()
    self.metadata = "<?xml version = '1.0' encoding = 'UTF-8' ?><documento></documento>"
  end
  

  def xml
    return REXML::Document.new(self.metadata)
  end


  elementos_xml = ["titulo", "titulo_html", "fecha_publicacion", "calificacion", "tiene_premio", "tutor","publico"]
  elementos_xml += ["resumen", "resumen_html", "palabras_clave"]
  elementos_xml += ["mencion", "licenciatura_id", "licenciatura", "escuela", "facultad", "universidad"]
  elementos_xml += ["extension_formato_archivo", "nombre_archivo", "texto"]
  elementos_xml += ["cantidad_downloads"]
  #elementos_xml += ["llave_conest"]

  elementos_xml.each do |elemento_xml|
    xpath_elemento = elemento_xml
    nombre_metodo_get = elemento_xml.split("/").reverse.join"_"
    #nombre_metodo_get.gsub!(/[][]/,"") #TODO acomodar la expresion regular
    nombre_metodo_set = nombre_metodo_get + "="
    #
    define_method(nombre_metodo_get){
      return "metadata no cargada" if metadata.nil?
      begin
        valor_elemento = self.xml.root.elements[xpath_elemento][0] # accede al xpath indicado
      rescue
        valor_elemento = ""
        puts "no se tiene el elemento en el xml, se devuelve una cadena vacia"
      end
      return "#{valor_elemento}"
    }
    define_method(nombre_metodo_set){ |argumento|
      xml = self.xml
      begin
        xml.root.elements[xpath_elemento][0] #para que explote si falta
        elemento = xml.root.elements[xpath_elemento] # accede al xpath indicado
      rescue
        elemento = xml.root.add_element("#{xpath_elemento}")
      end
      elemento.text = "#{argumento}"
      if xpath_elemento == "titulo_html" or xpath_elemento == "resumen_html"
        elemento.text = ""
        elemento.add(REXML::CData.new("#{argumento}"))
      end
      metadata.replace(xml.to_s)
    }
  end
  

  # para los autores
  elementos_xml_autor = ["nombre", "cedula", "correo", "telefonos", "promedio_general", "promedio_ponderado", "eficiencia"]
  for i in 1..CantidadMaximaAutores
    elementos_xml_autor.each do |elemento_autor|
      xpath_elemento = "autor[#{i}]/" + elemento_autor
      nombre_metodo_get = xpath_elemento.split("/").reverse.join"_"
      nombre_metodo_get.gsub!(Regexp.new("[\\]\\[]"), "") #TODO acomodar la expresion regular
      nombre_metodo_set = nombre_metodo_get + "="
      numero_autor_actual = "#{i}".to_i

      define_method(nombre_metodo_get){
        if self.cantidad_autores < numero_autor_actual
          puts "No existe el autor #{numero_autor_actual}"
          return ""
        end
        if metadata.nil?
          puts "Metadata no cargada" 
          return ""
        end
        begin
          valor_elemento = self.xml.root.elements[xpath_elemento][0] # accede al xpath indicado
        rescue
          valor_elemento = ""
          puts "no se tiene el elemento en el xml, se devuelve una cadena vacia"
        end
        return "#{valor_elemento}"
      }
    end
  end


  def cantidad_autores
    return xml.root.elements["count(//autor)"]
  end
  
  
  promedios_autores = ["eficiencia", "promedio_ponderado", "promedio_general"]
  
  promedios_autores.each{ |atributo| 
    nombre_metodo_get = atributo
    define_method(nombre_metodo_get){
      a = (1..(self.cantidad_autores)).to_a.collect{ |i| self.send("#{atributo}_autor#{i}").to_f}
      promedio = a.inject{ |sum,elem| sum + elem}/a.size
    }
  }
  
  def nombres_autores
    (1..(self.cantidad_autores)).to_a.collect{ |u| 
      self.send("nombre_autor#{u}")
    }.join(", ")
  end



  alias autor nombres_autores

  alias nota calificacion
  alias nota= calificacion=


  alias fecha fecha_publicacion
  alias fecha= fecha_publicacion=

  alias extension_archivo extension_formato_archivo
  alias extension_archivo= extension_formato_archivo=

  alias extension_formato extension_formato_archivo
  alias extension_formato= extension_formato_archivo=

  alias formato extension_formato_archivo
  alias formato= extension_formato_archivo=



end










=begin



<documento>
        <!--CONEST-->
	<titulo>El señor de los Gramillos</titulo>
	<titulo_enriquecido>Lord of rings</titulo_enriquecido>
	<fecha_publicacion>12-10-1999</fecha_publicacion>
	<calificacion>20</calificacion>
	<autor>
		<nombre>Paolo Cuello</nombre>
		<correo>paolo@paolo.com</correo>
		<telefonos>2739293 913823</telefonos>
		<peso_academico>4</peso_academico>
	</autor>
	<mencion>ati</mencion>
	<licenciatura>computacion</licenciatura>
	<escuela>computacion</escuela>
	<facultad>ciencias</facultad>
	<universidad>Universidad Central de Venezuela</universidad>

	<!--SISTEMA-->
	<texto>valor</valor>
	<extension_formato_archivo>valor</extension_formato_archivo>

	<!--POR ESTABLECER-->
	<resumen>valor<resumen>
	<palabras_clave>valores</palabras_clave>


</documento>



=end
