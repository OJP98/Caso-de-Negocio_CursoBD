var $ = require('jQuery');
var Pool = require('pg').Pool;

var atributos = []

var config=
{
	user:'postgres',
	database:'proyecto',
	password:'postgres',
	host:'127.0.0.1',
	port:5432,
	max:10,
};

var Pool = new Pool(config);

// FUNCIONES RELACIONADAS A LA TABLA DINÁMICA DE 'AGREGAR PRODUCTO'
function addRow() {

	var propiedad = document.getElementById("propiedad");
	var valor = document.getElementById("valor");
	var tabla = document.getElementById("tablaPropiedades");

	if (propiedad.value == "" || valor.value == "") {
		window.alert("Verifique que todos los campos sean válidos");
	} else {

		var rowCount = tabla.rows.length;
		var row = tabla.insertRow(rowCount);

		row.insertCell(0).innerHTML = propiedad.value;
		row.insertCell(1).innerHTML = valor.value;
		row.insertCell(2).innerHTML = '<a  style="margin: 5px" class="waves-effect waves-light btn-small" onClick="Javacsript:deleteRow(this)"><i class="material-icons">delete</a>';

		document.getElementById("propiedadesForm").reset();
	}

};

function deleteRow(obj) {

	var index = obj.parentNode.parentNode.rowIndex;
	var table = document.getElementById("tablaPropiedades");
	table.deleteRow(index);

};

function addInputs(atributo, tipo_dato) {

	console.log(tipo_dato)

	var type = "";

	if (tipo_dato == 'REAL' || tipo_dato == 'NUMERIC'){
		type = 'number'
	}

	else if (tipo_dato == 'VARCHAR' || tipo_dato == 'CHARACTER VARYING'){
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

	// Se añaden todos los atributos al div
	div.append(input);
	div.append(label);
	div.append(span);

	// Se añade el div al form
	form.append(div);	

}

async function getAttributes() {

	try
	{
		// Se consulta la tabla de datos
		var response = await Pool.query('SELECT * FROM datos');

		// Por cada dato en la respuesta
		for (var i = 0; i < response.rows.length; i++){

			// Se obtiene el atributo, su valor y se agrega a una lista
			var dict = response.rows[i]
			for(var key in dict) 
				atributos.push(dict[key])
		}

		// Se recorre la lista anteriormente mencionada y se hace el respectivo input
		for (var j = 0; j < atributos.length; j+=2){
			addInputs(atributos[j], atributos[j+1])
		}

	}
	catch(e)
	{
		console.error("Error",e);
	}
	
}