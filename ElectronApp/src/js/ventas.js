var Pool = require('pg').Pool;
var fs = require('fs');

var tiendas = ["Tienda A"];
var meses = ['Jan', 'Feb', 'Mar', 'Apr', 'May', "Jun", 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var clientesNuevos = [];

var config = {
    user: 'postgres',
    database: 'proyecto2',
    password: 'Juarez1998',
    host: '127.0.0.1',
    port: 5432,
    max: 10,
};

var config = {
    user: 'postgres',
    database: 'proyecto2DB',
    password: 'Javiercarpio1',
    host: '127.0.0.1'
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

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    var random = Math.random();
    // console.log("Random: " + random);
    return Math.floor(random * (Math.abs(max - min) + 1)) + min;
}

function readFile(){
    
    var options = {
        encoding: 'utf-8',
        flag: 'r'
    };

    var buffer = fs.readFileSync('src/js/clientes.txt', options);
    buffer = buffer.replace(',', '');
    var a = buffer.split("\n");

    return a
}

function writeFile(b){
    var options = {
        encoding: 'utf-8',
        flag: 'w'
    };

    var a = b.toString();

    fs.writeFileSync('src/js/clientes.txt', a.replace(",", "\n"), options);
}

function obtenerFecha(fechaInicial, fechaFinal){
    var mes = String(fechaInicial).substring(0, 3);
    var diaI = parseInt(String(fechaInicial).substring(4, 6));
    var anoI = parseInt(String(fechaInicial).substring(8, 12));
    var mesI = meses.indexOf(mes) + 1;

    var mes = String(fechaFinal).substring(0, 3);
    var diaF = parseInt(String(fechaFinal).substring(4, 6));
    var anoF = parseInt(String(fechaFinal).substring(8, 12));
    var mesF = meses.indexOf(mes) + 1;

    var ano = getRandom(anoI, anoF);
    var mes = getRandom(mesI, mesF);
    var dia = getRandom(diaI, diaF);

    return (ano + "-" + mes + "-" + dia)
}

async function crearFacturas() {
    clientesNuevos = readFile();

    var facturasCreadas = [];
    var fechaInicial = document.getElementById("inicio").value;
    var fechaFinal = document.getElementById("final").value;
    var lineas = parseInt(document.getElementById("cantidad").value);

    if (fechaInicial != '' && fechaFinal != '' && !isNaN(lineas)) {
        try {
            for(var i = 0; i < lineas; i++){
                             
                //-----------------------------------------------------------------
    
                var nuevaFactura = getRandom(1, 2);
    
                if(nuevaFactura == 1 || facturasCreadas.length == 0){
                    // console.log("Creando nueva factura....");
                    //-----------------------------------------------------------------

                    var nuevoCliente = getRandom(1, 10);
                    if(nuevoCliente == 2){
                        // Creacion de cliente.

                        var todoCliente = clientesNuevos[getRandom(0, clientesNuevos.length - 1)];

                        clientesNuevos.splice(clientesNuevos.indexOf(todoCliente), 1);

                        var a = todoCliente.split(';');
                        // console.log("Cliente: " + a[0] + " " + a[1]);
                        var query = "INSERT INTO clientes(nombre, nit) VALUES('" + a[0] + "', '" + a[1] + "');";
                        await Pool.query(query);

                        // console.log("Cliente nuevo creado");
                    }

                    var query = 'SELECT MAX(id), MIN(id) FROM clientes';
                    var response = await Pool.query(query);

                    var maxCliente = response.rows[0].max;
                    var minCliente = response.rows[0].min;
                    if(maxCliente === null){
                        maxCliente = 1;
                        minCliente = 1;
                    }

                    // console.log("El cliente es: " + maxCliente + " " + minCliente);
                    var idCliente = getRandom(minCliente, maxCliente);
                    
                    //-----------------------------------------------------------------
    
                    var tipoTienda = tiendas[getRandom(0, tiendas.length - 1)];

                    //-----------------------------------------------------------------

                    var fecha = obtenerFecha(fechaInicial, fechaFinal);

                    //-----------------------------------------------------------------

                    var query = "INSERT INTO facturas(clienteId, fecha, total, tienda) VALUES(" + idCliente + ", '" + fecha + "', NULL, '" + tipoTienda +"');";
                    // console.log("Factura: " + query);
                    await Pool.query(query);

                    //-----------------------------------------------------------------
                    
                    var response = await Pool.query('SELECT MAX(id) FROM facturas');
                    var ultimaFactura = response.rows[0].max;
                    facturasCreadas.push(ultimaFactura);
                    // console.log("Facturas creadas: " + facturasCreadas);
                }
    
                //-----------------------------------------------------------------
                
                var idFactura = facturasCreadas[getRandom(0, facturasCreadas.length - 1)];
                
                //-----------------------------------------------------------------

                var query = 'SELECT MAX(id), MIN(id) FROM productos';
                var response = await Pool.query(query);

                var maxPro = response.rows[0].max;
                var minPro = response.rows[0].min;
                if(maxPro === null){
                    maxPro = 1;
                    minPro = 1;
                }

                var idProducto = getRandom(parseInt(minPro), parseInt(maxPro));
                var cantidad = getRandom(1, 10);

                //-----------------------------------------------------------------
    
                var query = "SELECT checkId(" + idFactura + ", " + idProducto + ", " + cantidad + ");";
                // console.log(query);
                await Pool.query(query);
                console.log(i);
                
            }
        } catch (e) {
            console.error("My error", e);
            M.toast({ html: '¡Ocurrio un error!', classes: 'rounded' });
        }

        M.toast({ html: '¡Facturas creadas!', classes: 'rounded' });

        var query = 'DELETE FROM facturas WHERE total IS NULL;';
        await Pool.query(query);

        writeFile(clientesNuevos);
        console.log("Ya termine con: " + fechaInicial);
    }else{
        M.toast({html: '¡Hubo algun error!', classes: 'rounded'});
    }                       


}