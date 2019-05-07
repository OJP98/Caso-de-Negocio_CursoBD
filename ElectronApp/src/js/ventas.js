
var Pool = require('pg').Pool;

var tiendas = ["Tienda A", "Tienda B", "Tienda C"];

var config = {
    user: 'postgres',
    password: 'Javiercarpio1',
    database: 'proyecto2DB'
    
};

var Pool = new Pool(config);

function getRandom(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    var random = Math.random();
    // console.log("Random: " + random);
    return Math.floor(random * (Math.abs(max - min) + 1)) + min;
}

async function crearFacturas() {
    var fechaInicial = document.getElementById("fechaInicial").value;
    var fechaFinal = document.getElementById("fechaFinal").value;
    var lineas = parseInt(document.getElementById("cantidad").value);
    var response = await Pool.query('SELECT MAX(id) FROM facturas');

    // if(response.rows[0].max == null){
    //     console.log("Es null " + response.rows[0].max);
    // }
    
    
    try {
        for(var i = 0; i < lineas; i++){
            var response = await Pool.query('SELECT MAX(id), MIN(id) FROM clientes');
            var maximoCliente = response.rows[0].max;
            var minimoCliente = response.rows[0].min;

            var response = await Pool.query('SELECT MAX(id), MIN(id) FROM productos');
            var maximoProducto = response.rows[0].max;
            var minimoProducto = response.rows[0].min;

            if(maximoCliente === null){
                maximoCliente = 1;
                minimoCliente = 1;
            }

            if(maximoProducto === null){
                maximoProducto = 1;
                minimoProducto = 1;
            }

            var anoI = parseInt(String(fechaInicial).substring(0, 4));
            var mesI = parseInt(String(fechaInicial).substring(5, 7));
            var diaI = parseInt(String(fechaInicial).substring(8, 10));

            var anoF = parseInt(String(fechaFinal).substring(0, 4));
            var mesF = parseInt(String(fechaFinal).substring(5, 7));
            var diaF = parseInt(String(fechaFinal).substring(8, 10));

            var nuevaFactura = getRandom(1, 2);
            var response = await Pool.query('SELECT MAX(id) FROM facturas');

            if(nuevaFactura == 1 || response.rows[0].max == null){
                var idCliente = getRandom(minimoCliente, maximoCliente);
                var ano = getRandom(anoI, anoF);
                var mes = getRandom(mesI, mesF);
                var dia = getRandom(diaI, diaF);
                var tipoTienda = tiendas[getRandom(0, tiendas.length - 1)];
                // console.log(tipoTienda);
                var query = "INSERT INTO facturas(clienteId, fecha, total, tienda) VALUES(" + idCliente + ", '" + ano + "-" + mes + "-" + dia + "', NULL, '" + tipoTienda +"');";
                // console.log("Factura: " + query);
                var response = await Pool.query(query);
            }

            
            var response = await Pool.query('SELECT MAX(id), MIN(id) FROM facturas');
            var maximoFactura = response.rows[0].max;
            var minimoFactura = response.rows[0].min;

            if(maximoFactura === null){
                maximoFactura = 1;
                minimoFactura = 1;
            }
            
            var idFactura = getRandom(minimoFactura, maximoFactura);
            // console.log(minimoFactura + " " + maximoFactura + " " + idFactura);
            // console.log(parseInt(minimoProducto) + " " + parseInt(maximoProducto));
            var idProducto = getRandom(parseInt(minimoProducto), parseInt(maximoProducto));
            var cantidad = getRandom(1, 10);

            var query = "SELECT checkId(" + idFactura + ", " + idProducto + ", " + cantidad + ");";
            // console.log("Linea de factura: " + query);
            var response = await Pool.query(query);
        }
    } catch(e){
        console.error("My error", e);
    }
    console.log("LIsto");

    var query = 'DELETE FROM facturas WHERE total IS NULL;';
    var response = await Pool.query(query);
}

// var connectionString = 'postgres://localhost/proyecto2DB';

// var pgClient = new pg.Client(connectionString);
// pgClient.connect();



