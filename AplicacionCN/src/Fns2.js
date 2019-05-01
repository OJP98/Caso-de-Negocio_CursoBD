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

function actualizarTablaCont()
{
    var contenido=document.getElementById("tablaCont");
    var trVar=document.createElement("tr");
    var tdVar=document.createElement("td");
    var tdVar2=document.createElement("td");
    var NomAtributo=document.getElementById("NomAtrib").value;

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
    
    col1.push(NomAtributo);
    col2.push(valor);

    trVar.appendChild(tdVar);
    tdVar.innerHTML=NomAtributo;
    trVar.appendChild(tdVar2);
    tdVar2.innerHTML=valor;

    contenido.appendChild(trVar)


    createJSON();

}


function createJSON()
{
    var item = {};
    for (var i = 0; i < col1.length; i+=1) 
    {
        item [col1[i]] = col2[i];
        
    }
    
    localStorage['CustomData']=JSON.stringify(item);
    
}
