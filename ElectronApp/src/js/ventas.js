var Pool = require('pg').Pool;

var tiendas = ["Tienda A", "Tienda B", "Tienda C"];
var meses = ['Jan', 'Feb', 'Mar', 'Apr', 'May', "Jun", 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var config = {
    user: 'postgres',
    database: 'proyecto2',
    password: 'Juarez1998',
    host: '127.0.0.1',
    port: 5432,
    max: 10,
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

async function crearFacturas() {
    var fechaInicial = document.getElementById("inicio").value;
    var fechaFinal = document.getElementById("final").value;
    var lineas = parseInt(document.getElementById("cantidad").value);
    var response = await Pool.query('SELECT MAX(id) FROM facturas');
    // console.log(fechaInicial + " " + fechaFinal + " " + lineas);

    if (fechaInicial != '' && fechaFinal != '' && !isNaN(lineas)) {
        try {
            for (var i = 0; i < lineas; i++) {
                var response = await Pool.query('SELECT MAX(id), MIN(id) FROM clientes');
                var maximoCliente = response.rows[0].max;
                var minimoCliente = response.rows[0].min;

                var response = await Pool.query('SELECT MAX(id), MIN(id) FROM productos');
                var maximoProducto = response.rows[0].max;
                var minimoProducto = response.rows[0].min;

                if (maximoCliente === null) {
                    maximoCliente = 1;
                    minimoCliente = 1;
                }

                if (maximoProducto === null) {
                    maximoProducto = 1;
                    minimoProducto = 1;
                }

                var mes = String(fechaInicial).substring(0, 3);
                var diaI = parseInt(String(fechaInicial).substring(4, 6));
                var anoI = parseInt(String(fechaInicial).substring(8, 12));

                var mesI = meses.indexOf(mes) + 1;

                var mes = String(fechaFinal).substring(0, 3);
                var diaF = parseInt(String(fechaFinal).substring(4, 6));
                var anoF = parseInt(String(fechaFinal).substring(8, 12));

                var mesF = meses.indexOf(mes) + 1;

                var nuevaFactura = getRandom(1, 2);
                var response = await Pool.query('SELECT MAX(id) FROM facturas');

                if (nuevaFactura == 1 || response.rows[0].max == null) {
                    var idCliente = getRandom(minimoCliente, maximoCliente);
                    var ano = getRandom(anoI, anoF);
                    var mes = getRandom(mesI, mesF);
                    var dia = getRandom(diaI, diaF);

                    // console.log(ano + " " + mes + " " + dia)
                    var tipoTienda = tiendas[getRandom(0, tiendas.length - 1)];
                    // console.log(tipoTienda);
                    var query = "INSERT INTO facturas(clienteId, fecha, total, tienda) VALUES(" + idCliente + ", '" + ano + "-" + mes + "-" + dia + "', NULL, '" + tipoTienda + "');";
                    console.log("Factura: " + query);
                    var response = await Pool.query(query);
                }


                var response = await Pool.query('SELECT MAX(id), MIN(id) FROM facturas');
                var maximoFactura = response.rows[0].max;
                var minimoFactura = response.rows[0].min;

                if (maximoFactura === null) {
                    maximoFactura = 1;
                    minimoFactura = 1;
                }

                var idFactura = getRandom(minimoFactura, maximoFactura);
                // console.log(minimoFactura + " " + maximoFactura + " " + idFactura);
                // console.log(parseInt(minimoProducto) + " " + parseInt(maximoProducto));
                var idProducto = getRandom(parseInt(minimoProducto), parseInt(maximoProducto));
                var cantidad = getRandom(1, 10);

                var query = "SELECT checkId(" + idFactura + ", " + idProducto + ", " + cantidad + ");";
                console.log("Linea de factura: " + query);
                var response = await Pool.query(query);
            }
        } catch (e) {
            console.error("My error", e);
        }
        // console.log("LIsto");
        M.toast({ html: '¡Facturas creadas!', classes: 'rounded' });

        var query = 'DELETE FROM facturas WHERE total IS NULL;';
        var response = await Pool.query(query);
    } else {
        M.toast({ html: '¡Hubo algun error!', classes: 'rounded' });
    }


}