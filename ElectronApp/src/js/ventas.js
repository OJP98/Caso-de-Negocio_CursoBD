
var Pool = require('pg').Pool;
var fs = require('fs');

var tiendas = ["Tienda A", "Tienda B", "Tienda C"];
var meses = ['Jan', 'Feb', 'Mar', 'Apr', 'May', "Jun", 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var config = {
    user: 'postgres',
    password: 'karate16',
    database: 'proyecto2DB'
    
};

var Pool = new Pool(config);

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.datepicker');
    var options = {
        autoClose: true,
        yearRange: 30,
        maxDate: new Date('Dec 31, 2019')
    }
    var instances = M.Datepicker.init(elems, options);
});

function getRandom(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    var random = Math.random();
    // console.log("Random: " + random);
    return Math.floor(random * (Math.abs(max - min) + 1)) + min;
}

function readFile(file){
    var options = {
        encoding: 'utf-8',
        flag: 'r'
    }

    var buffer = fs.readFileSync(file, options);
    console.log("File content: " + buffer);
}

async function crearFacturas() {
    var facturasCreadas = [];
    var fechaInicial = document.getElementById("inicio").value;
    var fechaFinal = document.getElementById("final").value;
    var lineas = parseInt(document.getElementById("cantidad").value);

    if(fechaInicial != '' && fechaFinal != '' && !isNaN(lineas)){
        try {
            for(var i = 0; i < lineas; i++){
    
                var response = await Pool.query('SELECT MAX(id), MIN(id) FROM productos');
                var maximoProducto = response.rows[0].max;
                var minimoProducto = response.rows[0].min;

                //-----------------------------------------------------------------
    
                var mes = String(fechaInicial).substring(0, 3);
                var diaI = parseInt(String(fechaInicial).substring(4, 6));
                var anoI = parseInt(String(fechaInicial).substring(8, 12));
    
                var mesI = meses.indexOf(mes) + 1;
    
                var mes = String(fechaFinal).substring(0, 3);
                var diaF = parseInt(String(fechaFinal).substring(4, 6));
                var anoF = parseInt(String(fechaFinal).substring(8, 12));
    
                var mesF = meses.indexOf(mes) + 1;

                //-----------------------------------------------------------------
    
                var nuevaFactura = getRandom(1, 2);
    
                if(nuevaFactura == 1 || facturasCreadas.length == 0){
                    //-----------------------------------------------------------------

                    var nuevoCliente = getRandom(1, 2);
                    if(nuevoCliente == 1){
                        var idCliente = getRandom(minimoCliente, maximoCliente);
                    }else{
                        //Tomar de la informacion del txt de clientes y hacer el insert
                    }

                    var response = await Pool.query('SELECT MAX(id), MIN(id) FROM clientes');
                    var maximoCliente = response.rows[0].max;
                    var minimoCliente = response.rows[0].min;

                    if(maximoCliente === null){
                        maximoCliente = 1;
                        minimoCliente = 1;
                    }
        
                    if(maximoProducto === null){
                        maximoProducto = 1;
                        minimoProducto = 1;
                    }

                    //-----------------------------------------------------------------
                    
                    var ano = getRandom(anoI, anoF);
                    var mes = getRandom(mesI, mesF);
                    var dia = getRandom(diaI, diaF);
                    
                    //-----------------------------------------------------------------
    
                    var tipoTienda = tiendas[getRandom(0, tiendas.length - 1)];

                    //-----------------------------------------------------------------

                    var query = "INSERT INTO facturas(clienteId, fecha, total, tienda) VALUES(" + idCliente + ", '" + ano + "-" + mes + "-" + dia + "', NULL, '" + tipoTienda +"');";
                    console.log("Factura: " + query);
                    await Pool.query(query);

                    //-----------------------------------------------------------------
                    
                    var response = await Pool.query('SELECT MAX(id) FROM facturas');
                    var ultimaFactura = response.rows[0].max;
                    facturasCreadas.push(ultimaFactura);
                }
    
                //-----------------------------------------------------------------
                
                var idFactura = facturasCreadas[Math.floor(Math.random * facturasCreadas.length)];
                
                //-----------------------------------------------------------------

                var idProducto = getRandom(parseInt(minimoProducto), parseInt(maximoProducto));
                var cantidad = getRandom(1, 10);

                //-----------------------------------------------------------------
    
                var query = "SELECT checkId(" + idFactura + ", " + idProducto + ", " + cantidad + ");";
                console.log("Linea de factura: " + query);
                await Pool.query(query);
            }
        } catch(e){
            console.error("My error", e);
        }
        // console.log("LIsto");
        M.toast({html: '¡Facturas creadas!', classes: 'rounded'});

        var query = 'DELETE FROM facturas WHERE total IS NULL;';
        await Pool.query(query);
    }else{
        M.toast({html: '¡Hubo algun error!', classes: 'rounded'});
    }
    
    
}




