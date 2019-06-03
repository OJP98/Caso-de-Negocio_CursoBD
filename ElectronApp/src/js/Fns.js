var $ = require('jQuery');
var Pool = require('pg').Pool;
var mongo = require('mongodb');
var Db = require('mongodb').Db;
var assert = require('assert');
var Server = require('mongodb').Server;

var mongoArray = [];


var prodsWindow = false;
var nombreTienda = 'Tienda A';

// Adiciones de mongo
var MongoClient = mongo.MongoClient;
var url = 'mongodb://localhost:27017/lab15DB';

const {
    ipcRenderer
} = require('electron');

var idCategoria = 1,
    idMarca = 1,
    newDivId = 1;

var atributos = []

var config = {
    user: 'postgres',
    database: 'proyecto2',
    password: 'Juarez1998',
    host: '127.0.0.1',
    port: 5432,
    max: 10,
};

// var config = {
//     user: 'postgres',
//     password: 'karate16',
//     database: 'proyecto2DB'

// };

var Pool = new Pool(config);

function addRow() {

    var tabla = document.getElementById("tablaProductos");

    var rowCount = tabla.rows.length;
    var row = tabla.insertRow(rowCount);

    row.insertCell(0).innerHTML = '<input id="idProd1" type="text" class="validate" value="" style="margin:5px" required>';
    row.insertCell(1).innerHTML = '<input id="cantProd1" type="number" class="validate" value="" max="10" min="0" style="margin:5px" required>';
    row.insertCell(2).innerHTML = '<a style="margin: 5px" class="waves-effect waves-light btn-small" onClick="Javacsript:deleteRow(this)"><i class="material-icons">delete</a>';

};

function deleteRow(obj) {

    var index = obj.parentNode.parentNode.rowIndex;
    var table = document.getElementById("tablaProductos");
    table.deleteRow(index);

};

async function getAtributos() {
    console.log(localStorage['id']);
    var id = localStorage['id'];
    var query =
        'select p.nombre,p.precio,ca.descripcion, m.fabricante\
        from "productos" p,"categorias" ca, "marcas" m\
        where p.idcategoria=ca.id and m.id=p.idmarca and p.id=' + id + ';'

    var response = await Pool.query(query);

    var tabla = document.getElementById('tablaProductos');

    for (var i = 0; i < response.fields.length; i++) {
        var row = tabla.insertRow(-1);
        row.insertCell(0).innerHTML = response.fields[i].name;
        row.insertCell(1).innerHTML = response.rows[0][response.fields[i].name];
    }

    query = 'select atributo,valor from custom where idproducto=' + id + ';'

    response = await Pool.query(query);

    for (var i = 0; i < response.rows.length; i++) {
        var row = tabla.insertRow(-1);
        row.insertCell(0).innerHTML = response.rows[i]['atributo'];
        row.insertCell(1).innerHTML = response.rows[i]['valor'];
    }









};

function addInputs(atributo, tipo_dato) {

    var type = "";

    // Validación de tipo de dato
    if (tipo_dato == 'REAL' || tipo_dato == 'NUMERIC') {
        type = 'number'
    } else if (tipo_dato == 'VARCHAR' || tipo_dato == 'CHARACTER VARYING') {
        type = 'text'
    }

    // Se obtiene el formulario
    var form = document.getElementById("propiedadesForm");

    // Se crea la división
    var div = document.createElement("div");
    div.className = "input-field col s4";
    div.id = atributo;

    // Se crea el texto de la propiedad
    var label = document.createElement("label");
    label.setAttribute('for', 'prueba');
    label.innerText = atributo;

    // Se crea el span
    var span = document.createElement("span");
    span.className = "helper-text";

    // Se crea el input
    var input = document.createElement("input");
    input.required = true;
    input.type = type;
    input.className = "validate";
    input.id = atributo + "Input";

    // Se añaden todos los atributos al div
    div.append(input);
    div.append(label);
    div.append(span);

    // Se añade el div al form
    form.append(div);

}

async function validarNIT() {
    var nit = document.getElementById('nitInput').value;

    if (nit.length == 8) {
        var query = "SELECT nombre as nombres FROM clientes WHERE nit = '" + nit + "';";

        var response = await Pool.query(query);
        var persona = response.rows[0];
        var divNombre = document.getElementById('nuevo');

        if (persona != undefined) {
            console.log("Nombre: " + persona.nombres);
            divNombre.style.display = 'none';
        } else {
            console.log("No existe el nit");
            divNombre.style.display = '';

        }
    } else {
        if (nit.length != 0) {
            M.toast({
                html: 'NIT invalido',
                classes: 'rounded'
            });
        }
    }
}

async function guardarUsuario() {
    var nit = document.getElementById('nitInput').value;
    var nombre = document.getElementById('nombreInput').value;

    if (nit.length != '' && nombre.length != '') {
        var query = "INSERT INTO clientes(nombre, nit) VALUES('" + nombre + "', '" + nit + "');";
        var response = await Pool.query(query);
        var divNombre = document.getElementById('nuevo');
        divNombre.style.display = 'none';
        M.toast({
            html: '¡Usuario creado!',
            classes: 'rounded'
        });

    }
}



async function getAttributes() {

    // Se obtiene la categoría y marca seleccionada por el usuario
    var datalistCategorias = document.getElementById('categorias');
    var categoriasInput = document.getElementById('categoriasInput');

    var datalistMarcas = document.getElementById('marcas');
    var marcasInput = document.getElementById('marcasInput');


    // Se obtiene el index de la marca seleccionada
    for (var i = 0; i < datalistCategorias.options.length; i++) {
        if (datalistCategorias.options[i].value == categoriasInput.value) {
            idCategoria += i;
            break;
        }
    }

    // Se obtiene el index de la categoría seleccionada
    for (var i = 0; i < datalistMarcas.options.length; i++) {
        if (datalistMarcas.options[i].value == marcasInput.value) {
            idMarca += i;
            break;
        }
    }

    try {

        // Se seleccionan los atributos en base al id de la categoría
        var response = await Pool.query(`SELECT atributo, tipo_dato FROM datos WHERE idCategoria = ${idCategoria}`);


        // Por cada dato en la respuesta
        for (var i = 0; i < response.rows.length; i++) {

            // Se obtiene el atributo, su valor y se agrega a una lista
            var dict = response.rows[i]
            for (var key in dict)
                atributos.push(dict[key])
        }

        // Se recorre la lista anteriormente mencionada y se hace el respectivo input
        for (var j = 0; j < atributos.length; j += 2) {
            addInputs(atributos[j], atributos[j + 1])
        }

    } catch (e) {
        console.error("Error", e);
    }

}

async function saveProduct(idProducto) {

    // Declaracion de variables generales
    var formPropiedades = document.getElementById("propiedadesForm");
    var formGenerales = document.getElementById("generalesForm");

    var nombreProducto = document.getElementById("nombre_prod").value;
    var precioProducto = document.getElementById("precio_prod").value;

    var error = false;

    // Declaración del segundo query
    var query2 = `INSERT INTO productos (id, nombre, precio, idCategoria, idMarca) VALUES (${idProducto},'${nombreProducto}','${precioProducto}', ${idCategoria}, ${idMarca});`;

    try {
        await Pool.query(query2);
    } catch (e) {
        console.error("Error", e);
    }

    // Por cada atributo ingresado hasta el momento...
    for (var i = 0; i < atributos.length; i += 2) {

        // Se obtiene el nombre y el valor del atributo
        var nombre = atributos[i];
        var valor = document.getElementById(nombre + "Input").value;

        // Se hace el string con el query
        var query1 = `INSERT INTO custom (idproducto, valor, atributo, idCategoria) VALUES (${idProducto},'${valor}','${nombre}', ${idCategoria});`;

        // Se ejecuta el query
        try {
            await Pool.query(query1);
        } catch (e) {
            console.error("Error", e);
            error = true;
        }
    }

    // Impresión de mensajes en caso de éxito o error.
    if (error)
        alert("Se ha producido un error... Vuelva a intentarlo");
    else
        alert("¡Producto agregado con éxito!")

    // Reset de formularios
    formPropiedades.reset();
    formGenerales.reset();

}

async function getCategorias() {

    // Se selecciona el datalist
    var datalist = document.getElementById('categorias');

    // Se hace el string con el query
    var query = 'SELECT descripcion FROM categorias ORDER BY id';

    try {

        // Se ejecuta el query
        var response = await Pool.query(query);

        // Se recorre la respuesta del query y se añaden las categorías al datalist
        for (var i = 0; i < response.rows.length; i++) {
            var dict = response.rows[i]
            for (var key in dict) {
                var option = document.createElement("option");
                option.innerText = dict[key];
                datalist.append(option);
            }
        }

    } catch (e) {
        console.error("Error", e);
    }
}

async function getMarcas() {

    // Se selecciona el datalist
    var datalist = document.getElementById('marcas');

    // Se hace el string con el query
    var query = 'SELECT fabricante FROM marcas ORDER BY id';

    // Se ejecuta el query
    try {
        var response = await Pool.query(query);

        // Se recorre la respuesta del query y se añaden las categorías al datalist
        for (var i = 0; i < response.rows.length; i++) {
            var dict = response.rows[i]
            for (var key in dict) {
                var option = document.createElement("option");
                option.innerText = dict[key];
                datalist.append(option);
            }
        }

    } catch (e) {
        console.error("Error", e);
    }
}

async function getLastId() {

    // Se crea el query para obtener el último id
    var query = 'SELECT id FROM productos ORDER BY id DESC LIMIT 1;';
    var newProductId = 0;

    try {
        var response = await Pool.query(query);

        if (response.rows.length == 0) {
            newProductId = 1;

        } else {
            newProductId = response.rows[0]['id'] + 1;
        }

    } catch (e) {
        console.error("Error", e);
    }
    return (newProductId);
}

function addProductRow() {

    // Se crea un nuevo div
    newDivId += 1;

    // Se selecciona el div de los productos
    var productosDiv = document.getElementById("formProductos");

    // Se crean elementos tipo div
    var div1 = document.createElement('div');
    var div2 = document.createElement('div');

    // Se crea el id de ambos div
    var string1 = "idProd" + newDivId;
    var string2 = "cantProd" + newDivId;

    // Se inserta la data a ambos campos
    div1.innerHTML =
        `<div class="input-field col s3 offset-s3">\
            <input id="${string1}" type="text" class="validate" value="" required>\
            <label for="${string1}">ID del producto</label>\
        </div>`;

    div2.innerHTML =
        `<div class="input-field col s3">\
            <input id="${string2}" type="number" class="validate" value="" max="10" min="0" required>\
            <label for="${string2}">Cantidad</label>\
        </div>`;

    // Se añaden al div de productos
    productosDiv.appendChild(div1);
    productosDiv.appendChild(div2);
}

function removeProductRow() {

    // Se selecciona el div de productos
    var div = $('#formProductos').children().last();

    // Se verifica que aún haya algo que eliminar
    if (div.length > 0) {

        // Se eliminar los campos y se resta uno a la cantidad de campos
        $('#formProductos').children().last().remove();
        $('#formProductos').children().last().remove();
        newDivId -= 1;

        // Por alguna razón, al usar este else, truena :(
        // } else {
        //     // Muestra un mensaje de alerta
        //     alert("No hay más productos por eliminar");
    }
}

// Crea una nueva pantalla con los productos
function createProductsWindow() {

    ipcRenderer.send('show-products');

}

// Funcion que permite salir de la aplicacion cuando se cierra la ventana principal
function exitApplication() {
    const remote = require('electron').remote;
    let win = remote.getCurrentWindow();
    win.close();

}

function iniciar() {
    console.log(localStorage['CustomData']);
    document.getElementById("nombreDeLaTienda").innerHTML = localStorage['NombreTienda'] || 'Nombre de la tienda';
}

// Obitiene e inserta los productos en la tabla de productos
async function getProducts() {

    var query =
        'SELECT p.id, m.fabricante, p.nombre, p.precio\
    FROM productos p INNER JOIN marcas m ON m.id = p.idmarca\
    INNER JOIN categorias c ON c.id = p.idcategoria\
    ORDER BY c.descripcion;'

    var tabla = document.getElementById('tablaProductos');

    // Se ejecuta el query
    try {
        var response = await Pool.query(query);

        // Se recorre la respuesta del query y se añaden los productos a la tabla
        for (var i = 0; i < response.rows.length; i++) {

            // Se crea un diccionario por fila
            var dict = response.rows[i]

            // Se inserta en la última posición de la tabla
            var row = tabla.insertRow(-1);

            // Se insertan los valores por columna
            row.insertCell(0).innerHTML = dict["id"];
            row.insertCell(1).innerHTML = dict["fabricante"];
            row.insertCell(2).innerHTML = dict["nombre"];
            row.insertCell(3).innerHTML = dict["precio"];
        }
    } catch (e) {
        alert("Error", e);
    }

}

function hacerVenta() {

    // Obtener elementos del html
    var clienteNIT = document.getElementById('nitInput').value;
    var form = document.getElementById('formProductos');
    var div = document.getElementById('productos');

    var cantProductos = div.children.length / 2

    // Se crea una nueva factura
    nuevaFactura(clienteNIT).then(function() {

        // Se obtiene el id de la última factura creada
        var idFactura = getNuevaFacturaId();

        return (idFactura);

    }).then(function(idFactura) {

        var cantProductos = document.getElementById('formProductos').children.length / 2;

        // Se hace un for con la cantidad de productos ingresados
        for (let i = 1; i <= cantProductos; i++) {

            // Se obtiene el valor de cada input
            var prodId = document.getElementById("idProd" + i).value;
            var prodCant = document.getElementById("cantProd" + i).value;


            // Validación de campos
            if (prodId == "" || prodCant == "") {
                alert("Por favor llene todos los campos");
                break;
            }


            venderProducto(prodId, prodCant, idFactura);
        }
    }).then(function() {

        M.toast({
            html: 'Compra realizada con éxito!',
            classes: 'rounded'
        });

        form.reset();
    });



    // for (let j = cantProductos; j > 0; j--) {
    //     form.removeChild(form.lastChild);
    // }

}

// Función que crea una nueva factura y retorna el NIT del cliente que la hizo
async function nuevaFactura(clienteNIT) {

    // Query para obtener el ID del cliente
    var clienteIdQuery = `SELECT id FROM clientes WHERE nit = '${clienteNIT}';`

    try {
        // Se obtiene el ID del cliente
        var response = await Pool.query(clienteIdQuery);
        var clienteId = response.rows[0]["id"];

    } catch (e) {
        alert("Error", e);
        return true;
    }

    // Se obtiene la fecha de hoy para hacer la compra
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;

    // Query para instertar una nueva factura
    var queryFactura = `INSERT INTO facturas(clienteid, fecha, total, tienda) VALUES (${clienteId}, '${today}', null, '${nombreTienda}');`;

    try {
        // Se postea la nueva factura en la base de datos
        await Pool.query(queryFactura);

    } catch (e) {
        alert("Error", e);
        return true;
    }

    return clienteId;

}

async function getNuevaFacturaId() {
    var query = 'SELECT max(id) FROM facturas;'

    try {
        var response = await Pool.query(query);
        var facturaid = response.rows[0]["max"];
        return (facturaid)

    } catch (e) {
        alert("Error", e);
        return true;
    }
}

async function venderProducto(prodId, prodCant, idFactura) {

    var insertarLinea = `INSERT INTO lineas_de_facturas  (facturaid, idproducto, cantidad) VALUES (${idFactura}, ${prodId}, ${prodCant});`

    try {
        await Pool.query(insertarLinea);

    } catch (e) {
        alert("Error", e);
    }
}







var mejoresClientes = {};
var mejoresClientesOrdenado = [];

function getCollection() {

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("finalBD");
        dbo.collection("FacturaYLineas").find({}).toArray(function(err, result) {
            if (err) throw err;
            mongoArray = result;
            console.log("GET finished");
            db.close();
        });

    });
}


function pruebas() {

    var dict = {};
    var clientesDict = {}

    // Se crea el diccionario con llave: idFactura, value: idCliente, total
    mongoArray.forEach(item => {
        var facturaid = item.facturaid;
        if (dict[facturaid] == null) dict[facturaid] = new Array(item.clienteid, item.total);
    });

    for (var key in dict) {
        var clienteid = dict[key][0];
        var totalFactura = dict[key][1];

        clientesDict[clienteid] == null ? clientesDict[clienteid] = totalFactura : clientesDict[clienteid] += totalFactura
    }

    // Se ordena el diccionario, se mete a un array y se manda el id del mejor cliente
    var sortedList = sort_object(clientesDict);

    for (let i = 0; i < 5; i++) {
        var idCliente = sortedList[i][0];
        var gastado = sortedList[i][1];
        getByDPI(idCliente, gastado);
    }

    M.toast({
        html: 'Clientes cargados con éxito!',
        classes: 'rounded'
    });

    document.getElementById("topBtn").className = "waves-effect waves-light btn-large";
    document.getElementById("tweetBtn").className = "waves-effect waves-light btn-large";

}


function sort_object(obj) {
    items = Object.keys(obj).map(function(key) {
        return [key, obj[key]];
    });

    items.sort(function(first, second) {
        return second[1] - first[1];
    });

    return items;

}


function getByDPI(id, total) {

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("finalBD");

        // El "where" para el query
        var query = {
            id: parseInt(id)
        };

        // Se obtiene la primera instancia
        dbo.collection("Cliente").findOne(query, function(err, result) {
            if (err) throw err;
            mejoresClientes[result.nombre] = total;
            db.close();
        });
    });
}

function peekMejores() {
    mejoresClientesOrdenado = sort_object(mejoresClientes);

    let string = "Los mejores clientes, ordenados por volumen de facturación son los siguientes:\n\n" +
        "1. " + mejoresClientesOrdenado[0][0] + " - Q" + mejoresClientesOrdenado[0][1].toFixed(2) + "\n" +
        "2. " + mejoresClientesOrdenado[1][0] + " - Q" + mejoresClientesOrdenado[1][1].toFixed(2) + "\n" +
        "3. " + mejoresClientesOrdenado[2][0] + " - Q" + mejoresClientesOrdenado[2][1].toFixed(2) + "\n" +
        "4. " + mejoresClientesOrdenado[3][0] + " - Q" + mejoresClientesOrdenado[3][1].toFixed(2) + "\n" +
        "5. " + mejoresClientesOrdenado[4][0] + " - Q" + mejoresClientesOrdenado[4][1].toFixed(2) + "\n";

    document.getElementById('idContent').innerText = string;
}

function prepareTweet() {
    mejoresClientesOrdenado = sort_object(mejoresClientes);

    let nombre1 = mejoresClientesOrdenado[0][0],
        nombre2 = mejoresClientesOrdenado[1][0],
        nombre3 = mejoresClientesOrdenado[2][0],
        nombre4 = mejoresClientesOrdenado[3][0],
        nombre5 = mejoresClientesOrdenado[4][0]

    let string = `¡Las siguientes personas, clientes de ALMACENES GÜALMAR, tendrán una oferta especial en TODAS sus compras de esta semana!

    ${nombre1} - 45%
    ${nombre2} - 40%
    ${nombre3} - 30%
    ${nombre4} - 25%
    ${nombre5} - 20%`

    document.getElementById('idContent2').innerText = string;
}