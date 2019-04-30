	DROP TABLE IF EXISTS clientes;
	CREATE TABLE clientes
	(
		 id 			SERIAL PRIMARY KEY,
		 nombre 		varchar,
		 nit			varchar
	);

	DROP TABLE IF EXISTS categorias;
	CREATE TABLE categorias
	(
		id 				SERIAL PRIMARY KEY,
		descripcion 	varchar
	);

	DROP TABLE IF EXISTS marcas;
	CREATE TABLE marcas
	(
		id 				SERIAL PRIMARY KEY,
		fabricante 		varchar
	);

	CREATE TABLE productos
	(
		id 				SERIAL PRIMARY KEY,
		nombre 			varchar,
		precio 			real,
		idCategorias 	int,
		idMarcas 		int,
		FOREIGN KEY (idCategorias) REFERENCES categorias (id),
		FOREIGN KEY (idMarcas) REFERENCES marcas (id)
	);


	CREATE TABLE custom
	(
		idProducto 		int PRIMARY KEY,
		data 			JSON,
		FOREIGN KEY (idProducto) REFERENCES productos (id)
	);

	CREATE TABLE facturas
	(
		id 				SERIAL PRIMARY KEY,
		clienteId 		int,
		fecha 			date,
		total 			real,
		FOREIGN KEY (clienteId) REFERENCES clientes (id)
	);

	CREATE TABLE líneas_de_facturas
	(
		facturaId 		SERIAL,
		idProducto 		int,
		cantidad 		int,
		FOREIGN KEY (facturaId) REFERENCES facturas (id),
		FOREIGN KEY (idProducto) REFERENCES productos (id)
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





