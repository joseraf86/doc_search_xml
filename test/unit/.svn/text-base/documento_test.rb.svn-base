require File.dirname(__FILE__) + '/../test_helper'

class DocumentoTest < Test::Unit::TestCase
  fixtures :documento

  # Replace this with your real tests.
  def test_truth
    assert true
  end
  
  def test_consistencia_xml
    doc = Documento.find 1
    assert_equal "Trabajo de Tesis General de Juan", doc.titulo 
    assert_equal "El resumen es una muestra del contenido del documento", doc.resumen
    assert_equal "no", doc.tiene_premio
    assert_equal doc.promedio_ponderado_autor1.to_f, doc.promedio_ponderado
  end
  
  def test_consistencia_2_autores
    doc = Documento.find 2
    assert_equal 2, doc.cantidad_autores
    assert_equal REXML::Document.new(doc.metadata).root.elements["count(//autor)"], doc.cantidad_autores
    assert_equal "JOSE RODRIGUEZ", doc.nombre_autor1
    assert_equal "ANA FLOR", doc.nombre_autor2
    assert_equal "10.51", doc.promedio_ponderado_autor1
    assert_equal "18.51", doc.promedio_ponderado_autor2
    assert_equal "14.51", doc.promedio_ponderado.to_s
  end
  
  def test_cambios_correctos
    atributos = ["titulo", "resumen", "palabras_clave"]
    doc = Documento.find 1
    doc_anterior = Documento.new
    doc_anterior.update_attributes(Hash[*atributos.collect{|actual| [:"#{actual}", doc.send(actual)] }.flatten])
    #puts doc.inspect
    atributos.each{ |atributo|
      doc.send("#{atributo}=", "un cambio")
      assert_not_equal doc_anterior.send(atributo), doc.send(atributo)
    }
    
  end
  
end
