var $ = require('jQuery');
const fs = require('fs');

function makeJson() {
    var myRows = [];
    var $headers = $("th");
    var $rows = $("tbody tr").each(function (index) {
        $cells = $(this).find("td");
        myRows[index] = {};
        $cells.each(function (cellIndex) {
            myRows[index][$($headers[cellIndex]).html()] = $(this).html();
        });
    });

    var myObj = {};
    myObj.myrows = myRows;
    // var json = JSON.stringify(myObj);​

    console.log(json);
};


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

function load() {

    console.log("Page load finished");

};