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






// FUNCIONES RELACIONADAS A LA TABLA DINÁMICA DE 'configurar.html'
function addRow() {

    // La propiedad del producto -> Jalas el input
    var propiedad = document.getElementById("NomAtrib");


    // Se refiere a la tabla del html
    var tabla = document.getElementById("tabla");

    var RadioNumero=document.getElementById("RadioNum").checked;
        
    var valor="";
    if(RadioNumero===false)
    {
        valor="Texto";
    }
    else
    {
        valor="Número";
    }


    if (propiedad.value == "") {
        window.alert("Verifique que todos los campos sean válidos");
    } else {

        var rowCount = tabla.rows.length;
        var row = tabla.insertRow(rowCount);

        row.insertCell(0).innerHTML = propiedad.value;
        row.insertCell(1).innerHTML = valor;
        row.insertCell(2).innerHTML = '<a  style="margin: 5px" class="waves-effect waves-light btn-small" onClick="Javacsript:deleteRow(this)"><i class="material-icons">delete</a>';

        col1.push(propiedad.value);
        col2.push(valor);

        // Reinicia el formulario, si tenes uno.
        document.getElementById("FormAgregarAtributo").reset();


        createJSON();

    }

};

function deleteRow(obj) {

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
    createJSON();

};

function createJSON()
{
    var item = {};
    for (var i = 0; i < col1.length; i+=1) 
    {
        item [col1[i]] = col2[i];
        
    }
    
    localStorage['CustomData']=JSON.stringify(item);
    
}
