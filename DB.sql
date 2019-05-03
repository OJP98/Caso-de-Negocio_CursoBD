DROP TABLE IF EXISTS clientes CASCADE;
CREATE TABLE clientes
(
	 id 			SERIAL PRIMARY KEY,
	 nombre 		varchar,
	 nit			varchar
);

DROP TABLE IF EXISTS categorias CASCADE;
CREATE TABLE categorias
(
	id 				SERIAL PRIMARY KEY,
	descripcion 	varchar
);

DROP TABLE IF EXISTS marcas CASCADE;
CREATE TABLE marcas
(
 	id 				SERIAL PRIMARY KEY,
 	fabricante 		varchar
);

DROP TABLE IF EXISTS productos CASCADE;
CREATE TABLE productos
(
	id 				SERIAL PRIMARY KEY,
	nombre 			varchar,
	precio 			real,
	idCategoria 	int,
	idMarca 		int,
	FOREIGN KEY (idCategoria) REFERENCES categorias (id),
	FOREIGN KEY (idMarca) REFERENCES marcas (id)
);

DROP TABLE IF EXISTS custom CASCADE;
CREATE TABLE custom
(
	idProducto 		int,
	atributo		VARCHAR,
	valor			VARCHAR,
	idCategoria 		int,

	FOREIGN KEY (idProducto) REFERENCES productos (id),
	FOREIGN KEY (idCategoria) REFERENCES categorias (id)

);

DROP TABLE IF EXISTS datos CASCADE;
CREATE TABLE datos
(
	atributo 		VARCHAR,
	tipo_dato		VARCHAR,
	idCategoria 	int,

	FOREIGN KEY (idCategoria) REFERENCES categorias (id)

);

DROP TABLE IF EXISTS facturas CASCADE;
CREATE TABLE facturas
(
 	id 				SERIAL PRIMARY KEY,
 	clienteId 		int,
 	fecha 			date,
 	total 			real,
	tienda			VARCHAR,
	FOREIGN KEY (clienteId) REFERENCES clientes (id)
);

DROP TABLE IF EXISTS lineas_de_facturas CASCADE;
CREATE TABLE lineas_de_facturas
(
 	facturaId 		SERIAL,
 	idProducto 		int,
 	cantidad 		int,
	FOREIGN KEY (facturaId) REFERENCES facturas (id),
	FOREIGN KEY (idProducto) REFERENCES productos (id)
);


DROP FUNCTION IF EXISTS updateSUMTotal;
CREATE OR REPLACE FUNCTION updateSUMTotal() 
RETURNS TRIGGER AS
$BODY$
BEGIN 
	UPDATE facturas 
	SET total = (SELECT SUM(p.precio * lf.cantidad)
				FROM lineas_de_facturas as lf
				JOIN productos p ON lf.idproducto = p.id
				WHERE facturas.id = lf.facturaid);
	RETURN NEW;
END;
$BODY$
LANGUAGE PLPGSQL;

DROP FUNCTION IF EXISTS checkId;
CREATE OR REPLACE FUNCTION checkId(
	factura INT, 
	producto INT, 
	cantidad INT) 
RETURNS VOID AS
$BODY$
DECLARE
	idNuevo INT = factura;
	validacion BOOL = false;
BEGIN 
	WHILE validacion != true LOOP
		PERFORM *
		FROM facturas
		WHERE id = idNuevo;
		IF NOT FOUND THEN
			idNuevo = idNuevo + 1;
		ELSE
			validacion = true;
		END IF;
	END LOOP;
		
	INSERT INTO lineas_de_facturas(facturaid, idproducto, cantidad) VALUES(idNuevo, producto, cantidad);
END;
$BODY$
LANGUAGE PLPGSQL;

DROP TRIGGER IF EXISTS updateTotal ON lineas_de_facturas;
CREATE TRIGGER updateTotal AFTER INSERT ON lineas_de_facturas FOR EACH ROW EXECUTE PROCEDURE updateSUMTotal(); 


--select data->>'Talla' from custom

INSERT INTO clientes(nombre, nit) VALUES('Javier Carpio', '577019-K');
INSERT INTO clientes(nombre, nit) VALUES('Jose Cifuentes', '123456-K');
INSERT INTO clientes(nombre, nit) VALUES('Oscar Juarez', '654321-K');

INSERT INTO categorias(descripcion) VALUES('Comida');
INSERT INTO categorias(descripcion) VALUES('Ropa');
INSERT INTO categorias(descripcion) VALUES('Electronico');

INSERT INTO marcas(fabricante) VALUES('ADIDAS');
INSERT INTO marcas(fabricante) VALUES('McDonalds');
INSERT INTO marcas(fabricante) VALUES('Intelaf');

INSERT INTO productos(nombre, precio, idCategoria, idMarca) VALUES('Hamburguesa', 40.5, 1, 2);
INSERT INTO productos(nombre, precio, idCategoria, idMarca) VALUES('Laptop', 10000, 3, 3);
INSERT INTO productos(nombre, precio, idCategoria, idMarca) VALUES('Adizero', 850, 2, 1);

INSERT INTO facturas(clienteId, fecha, total, tienda) VALUES(1, '2015-05-05', NULL, 'Tienda A');
SELECT checkId(1, 1, 5);

INSERT INTO datos (atributo, tipo_dato, idcategoria) VALUES ('Talla', 'NUMERIC',2);
INSERT INTO datos (atributo, tipo_dato, idcategoria) VALUES ('Color', 'VARCHAR',2);
INSERT INTO datos (atributo, tipo_dato, idcategoria) VALUES ('Material', 'VARCHAR',2);

-- SELECT * FROM clientes;
-- SELECT * FROM categorias;
-- SELECT * FROM productos;
-- SELECT * FROM facturas;
-- SELECT * FROM lineas_de_facturas;
-- SELECT * FROM productos;
-- SELECT * FROM datos;
-- SELECT * FROM custom;