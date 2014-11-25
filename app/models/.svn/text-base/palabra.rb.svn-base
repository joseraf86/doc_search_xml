class Palabra < ActiveRecord::Base


  def nula?
    return self.class.omitidas.include?(self.texto)
  end


  def self.omitidas(otras_mas = [])
    pronombres = []
    pronombres += %w[me te se nos os lo los la las le les yo tu vos el ella ellas ello ellos usted ustedes nosotros nosotras vosotros vosotras mi ti si] #personales
    pronombres += %w[nos os se del con el etc ] # reciprocos
    pronombres += %w[este estos esta estas ese esos esa esas aquel aquella aquellos aquellas] # demostrativos
    pronombres += %w[mi mio mios mia mias tu tuyo tuyos tuya tuyas su suyo suyos suya suyas nuestro nuestros nuestra nuestras vuestro vuestros vuestra vuestras] # posesivos
    pronombres += %w[el que cual cuales quien quienes cuyo cuya cuyos cuyas] # relativos
    pronombres += %w[donde cuando] # interogativos
    pronombres += %w[alguno algunos alguna algunas varios varias alguien nadie otro otros otra otras cualquier cualquiera] # indefinidos
    articulos = []
    articulos += %w[el la lo  los  las un unos una unas]
    adverbios = []
    adverbios += %w[ahora ayer anteayer hoy manana antes anoche aun cuando despues entonces jamas luego mientras nunca primero siempre tarde todavia ya] # de tiempo
    adverbios += %w[aqui alli alla aca fuera abajo delante adelante alrededor arriba atras cerca debajo donde encima enfrente fuera lejos] # de lugar
    adverbios += %w[asi asimismo bien mal casi como despacio rapido lento deprisa] # de modo
    adverbios += %w[no nunca tampoco jamas] # de negacion
    adverbios += %w[si claro exacto efectivamente ciertamente seguramente justo ya tambien] # de afirmacion
    adverbios += %w[casi cuanto demasiado mas menos mucho poco todo solo mitad tan tanto muy] # de cantidad
    adverbios += %w[quizas acaso probable tal vez etc] # duda
    conjunciones = []
    conjunciones += %w[y ]
    preposiciones = []
    preposiciones += %w[a ante bajo con contra de desde en entre hacia hasta para por segun sin so sobre tras durante mediante]
    #
    return pronombres + articulos + adverbios + conjunciones + preposiciones
  end
  
  

end
