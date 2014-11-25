se crea la base de datos de pruebas
en mysql se hace
  create database app_tesis_test

luego desde la raiz del proyecto
rake db:test:clone_structure

se llenan los fixtures (yaml para los datos iniciales de la base de datos)


rake clone_structure_to_test


