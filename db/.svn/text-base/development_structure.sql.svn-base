CREATE TABLE `documento` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `archivo` longblob NOT NULL,
  `metadata` longtext NOT NULL,
  `peso_numerico1` int(10) unsigned NOT NULL default '0',
  `peso_numerico2` int(10) unsigned NOT NULL default '0',
  `peso_numerico3` int(10) unsigned NOT NULL default '0',
  `peso_numerico4` int(10) unsigned NOT NULL default '0',
  `procesado` tinyint(1) default '0',
  `md5` text,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

CREATE TABLE `documento_palabra` (
  `documento_id` int(10) unsigned NOT NULL,
  `palabra_id` int(10) unsigned NOT NULL default '0',
  `frecuencia_en_contenido` int(10) unsigned NOT NULL default '0',
  `frecuencia_en_titulo` int(10) unsigned NOT NULL default '0',
  `frecuencia_en_palabras_clave` int(10) unsigned NOT NULL default '0',
  `frecuencia_en_resumen` int(10) unsigned NOT NULL default '0',
  `frecuencia_en_autor` int(10) unsigned NOT NULL default '0',
  PRIMARY KEY  (`documento_id`,`palabra_id`),
  KEY `documento_has_palabra_FKIndex1` (`documento_id`),
  KEY `documento_has_palabra_FKIndex2` (`palabra_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `palabra` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `texto` varchar(45) NOT NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `indice_unico_texto` (`texto`)
) ENGINE=InnoDB AUTO_INCREMENT=4058 DEFAULT CHARSET=latin1;

CREATE TABLE `parametro_general` (
  `id` varchar(45) NOT NULL,
  `valor` varchar(45) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

