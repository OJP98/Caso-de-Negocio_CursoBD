var $ = require('jQuery');
var Pool = require('pg').Pool;

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
    password: 'postgres',
    host: '127.0.0.1',
    port: 5432,
    max: 10,
};

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
    var productosDiv = document.getElementById("productos");

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
    var div = $('#productos').children().last();

    // Se verifica que aún haya algo que eliminar
    if (div.length > 0) {

        // Se eliminar los campos y se resta uno a la cantidad de campos
        $('#productos').children().last().remove();
        $('#productos').children().last().remove();
        newDivId -= 1;

    } else {
        // Muestra un mensaje de alerta
        alert("No hay más productos por eliminar");
    }
}

function createProductsWindow() {
    ipcRenderer.send('show-products');
}