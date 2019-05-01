CREATE TABLE clientes
(
	 id 			int PRIMARY KEY,
	 nombre 		varchar,
	 nit			varchar
);


CREATE TABLE productos
(
	id 				int PRIMARY KEY,
	nombre 			varchar,
	precio 			real,
	idCategorias 	int,
	idMarcas 		int
);


CREATE TABLE custom
(
	idProducto 		int PRIMARY KEY,
	data 			JSON
);

insert into custom values 
(1,
	'{
  "Talla": 5,
  "var2": "Hola2",
  "var3": "Hola3"
	}'
);

select data->>'Talla' from custom


CREATE TABLE categorías
(
	id 				int PRIMARY KEY,
	descripcion 	varchar
);

CREATE TABLE marcas
(
 	id 				int PRIMARY KEY,
 	fabricante 		varchar
);

CREATE TABLE facturas
(
 	id 				int PRIMARY KEY,
 	clienteId 		int,
 	fecha 			date,
 	total 			real
);

CREATE TABLE líneas_de_facturas
(
 	facturaId 		int,
 	idProducto 		int,
 	cantidad 		int
);
