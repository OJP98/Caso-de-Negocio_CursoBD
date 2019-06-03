DROP TABLE IF EXISTS clienteExterno;
CREATE EXTERNAL TABLE clienteExterno(
	 id 			INT,
	 nombre 		STRING,
	 nit			STRING
	)
	ROW FORMAT DELIMITED
	FIELDS TERMINATED BY ','
	STORED AS TEXTFILE
	location '/ProyectoFinal/Cliente';
DROP TABLE IF EXISTS cliente;
CREATE TABLE IF NOT EXISTS cliente(
	 id 			INT,
	 nombre 		STRING,
	 nit			STRING
	)
    ROW FORMAT DELIMITED
    FIELDS TERMINATED BY ','
    STORED AS ORC;
INSERT OVERWRITE TABLE cliente SELECT * FROM clienteExterno;

DROP TABLE IF EXISTS categoriaExterno;
CREATE EXTERNAL TABLE categoriaExterno(
	 id 			INT,
	 descripcion 		STRING
	)
	ROW FORMAT DELIMITED
	FIELDS TERMINATED BY ','
	STORED AS TEXTFILE
	location '/ProyectoFinal/Categoria';
DROP TABLE IF EXISTS categoria;
CREATE TABLE IF NOT EXISTS categoria(
	 id 			INT,
	 descripcion 		STRING
	)
    ROW FORMAT DELIMITED
    FIELDS TERMINATED BY ','
    STORED AS ORC;
INSERT OVERWRITE TABLE categoria SELECT * FROM categoriaExterno;


DROP TABLE IF EXISTS facturaYLineasExterno;
CREATE EXTERNAL TABLE facturaYLineasExterno(
	facturaid				int,
  	clienteid				int,
  	idproducto				int,
 	cantidad 		int,
 	fecha 		string,
  	tienda			string,
 	total 			double
	)
	ROW FORMAT DELIMITED
	FIELDS TERMINATED BY ','
	STORED AS TEXTFILE
	location '/ProyectoFinal/FacturaYLineas';
DROP TABLE IF EXISTS facturaYLineas;
CREATE TABLE IF NOT EXISTS facturaYLineas(
	facturaid				int,
  	clienteid				int,
  	idproducto				int,
 	cantidad 		int,
 	fecha 		string,
  	tienda			string,
 	total 			double
	)
    ROW FORMAT DELIMITED
    FIELDS TERMINATED BY ','
    STORED AS ORC;
INSERT OVERWRITE TABLE facturaYLineas SELECT * FROM facturaYLineasExterno;


DROP TABLE IF EXISTS fechaExterno;
CREATE EXTERNAL TABLE fechaExterno(
string_actual			string,
  	semana			int,
  	mes				int,
 	trimestre 		int,
 	year 		string,
  	dia			string,
 	diaDelMes 			double
	)
	ROW FORMAT DELIMITED
	FIELDS TERMINATED BY ','
	STORED AS TEXTFILE
	location '/ProyectoFinal/Fecha';
DROP TABLE IF EXISTS fecha;
CREATE TABLE IF NOT EXISTS fecha(
string_actual			string,
  	semana			int,
  	mes				int,
 	trimestre 		int,
 	year 			int,
  	dia			string,
 	diaDelMes 			double
	)
    ROW FORMAT DELIMITED
    FIELDS TERMINATED BY ','
    STORED AS ORC;
INSERT OVERWRITE TABLE fecha SELECT * FROM fechaExterno;

DROP TABLE IF EXISTS marcaExterno;
CREATE EXTERNAL TABLE marcaExterno(
	 id 			INT,
	 marca 		STRING
	)
	ROW FORMAT DELIMITED
	FIELDS TERMINATED BY ','
	STORED AS TEXTFILE
	location '/ProyectoFinal/Marca';
DROP TABLE IF EXISTS marca;
CREATE TABLE IF NOT EXISTS marca(
	 id 			INT,
	 marca 		STRING
	)
    ROW FORMAT DELIMITED
    FIELDS TERMINATED BY ','
    STORED AS ORC;
INSERT OVERWRITE TABLE marca SELECT * FROM marcaExterno;


DROP TABLE IF EXISTS productoExterno;
CREATE EXTERNAL TABLE productoExterno(
	id 			INT,
	nombre 		STRING,
  	precio			double,
  	idCategoria 	INT,
  	idMarca 			INT)
	ROW FORMAT DELIMITED
	FIELDS TERMINATED BY ','
	STORED AS TEXTFILE
	location '/ProyectoFinal/Producto';
DROP TABLE IF EXISTS producto;
CREATE TABLE IF NOT EXISTS producto(
	id 			INT,
	nombre 		STRING,
  	precio			double,
  	idCategoria 			INT,
  	idMarca 			INT)
    ROW FORMAT DELIMITED
    FIELDS TERMINATED BY ','
    STORED AS ORC;
INSERT OVERWRITE TABLE producto SELECT * FROM productoExterno;