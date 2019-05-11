var Pool = require('pg').Pool;

var config = {
    user: 'postgres',
    password: 'karate16',
    database: 'proyecto2DB'
    
};

var Pool = new Pool(config);




function iniciar() 
{
    console.log(localStorage['CustomData']);
    document.getElementById("nombreDeLaTienda").innerHTML=localStorage['NombreTienda']|| 'Nombre de la tienda';
}


function ingresarNombreTienda()
{
    console.log("Nombre de tienda");
    var nombre=document.getElementById("nombreTienda").value;
    localStorage['NombreTienda']=nombre;

    document.getElementById("nombreDeLaTienda").innerHTML=localStorage['NombreTienda']|| 'Nombre de la tienda';

}

var col1=[];
var col2=[];


async function ingresarInformacion()
{
    M.toast({ html: 'Atributos agregados a categoría', classes: 'rounded' });
    var categoria=document.getElementById("NomCat").value;
    console.log(categoria);

    var query = "select * from categorias  where descripcion LIKE '"+categoria+"'"+";";
    var response = await Pool.query(query);
    var id;

    if(response.rowCount===0)
    {
        var query = "INSERT INTO categorias(descripcion) VALUES('"+categoria+"');";
        var response = await Pool.query(query);
        console.log(response);

        var query2 = "select max(id) from categorias";
        var response = await Pool.query(query2);
        id=response.rows[0].max;
        console.log(id);
    }
    else
    {
        var query = "select id from categorias where descripcion LIKE '"+categoria+"';";
        var response = await Pool.query(query);
        id=response.rows[0].id;
    }
    

    for (var i = 0; i < col1.length; i+=1) 
    {
        var query3 = `INSERT INTO datos (atributo, tipo_dato, idcategoria) VALUES ('${col1[i]}','${col2[i]}','${id}');`;
        var response = await Pool.query(query3);

    }
    document.getElementById("todo").reset();
    document.getElementById("Tabla").reset();
    
      

}

// FUNCIONES RELACIONADAS A LA TABLA DINÁMICA DE 'configurar.html'
function addRow2() {

    // La propiedad del producto -> Jalas el input
    var propiedad = document.getElementById("NomAtrib");


    // Se refiere a la tabla del html
    var tabla = document.getElementById("tabla");

    var RadioNumero=document.getElementById("RadioNum").checked;
        
    var valor="";
    if(RadioNumero===false)
    {
        valor="VARCHAR";
    }
    else
    {
        valor="NUMERIC";
    }


    if (propiedad.value == "") {
        M.toast({ html: 'Verifique que todos los campos sean válidos', classes: 'rounded' });
    } else {

        M.toast({ html: 'Atributo agregado correctamente', classes: 'rounded' });
        var rowCount = tabla.rows.length;
        var row = tabla.insertRow(rowCount);

        row.insertCell(0).innerHTML = propiedad.value;
        row.insertCell(1).innerHTML = valor;
        row.insertCell(2).innerHTML = '<a  style="margin: 5px" class="waves-effect waves-light btn-small" onClick="Javacsript:deleteRow2(this)"><i class="material-icons">delete</a>';

        col1.push(propiedad.value);
        col2.push(valor);

        // Reinicia el formulario, si tenes uno.
        document.getElementById("FormAgregarAtributo").reset();

        console.log(col1);
        console.log(col2);
            


    }

};

function deleteRow2(obj) {

    M.toast({ html: 'Atributo eliminado correctamente', classes: 'rounded' });
    var index = obj.parentNode.parentNode.rowIndex;
    var table = document.getElementById("tabla");
    table.deleteRow(index);
    console.log(index);

    var col1Copia=[];
    var col2Copia=[];

    var contador=0;
    for (var i = 0; i < col1.length; i+=1) 
    {
        if(i===index-1)
        {
            continue;
        }
        else
        {
            col1Copia[contador]=col1[i];
            col2Copia[contador]=col2[i];
            contador++;
            
        }
        
        
    }

    col1=col1Copia;
    col2=col2Copia;

};

