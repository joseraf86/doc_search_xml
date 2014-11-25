class Paginador
  
  attr_accessor :claves_primarias
  attr_accessor :clase
  attr_accessor :objetos_por_pagina
  attr_accessor :indice_pagina_actual
  

  def initialize(args)
    self.clase = args[:clase]
    self.claves_primarias = args[:claves_primarias]
    self.objetos_por_pagina = args[:objetos_por_pagina]
    self.indice_pagina_actual = 0
    self.indice_pagina_actual = -1 if !(self.claves_primarias.size > 0)
  end
  

  def pagina_actual
    self.indice_pagina_actual + 1
  end


  def pagina_actual=(i)
    return if self.indice_pagina_actual == -1
    if i < 1
      self.indice_pagina_actual = 0
    elsif i > self.cantidad_paginas
      self.indice_pagina_actual = self.cantidad_paginas() - 1
    else
      self.indice_pagina_actual =  i - 1
    end
  end
  
    
  def cantidad_paginas
    numero = self.claves_primarias.size / self.objetos_por_pagina
    numero += 1 if self.claves_primarias.size % self.objetos_por_pagina > 0
    return numero
  end
  
  
  def objetos
    li = indice_pagina_actual * objetos_por_pagina
    cantidad_objetos = objetos_por_pagina
    ls = li + claves_primarias.size % objetos_por_pagina if pagina_actual == cantidad_paginas and claves_primarias.size % objetos_por_pagina > 0
    objs = []
    claves_primarias[li,cantidad_objetos].each{ | pk |
      objs << self.clase.find(pk)
    }
    return objs
  end


end



