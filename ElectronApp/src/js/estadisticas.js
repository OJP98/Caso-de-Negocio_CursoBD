var Pool = require('pg').Pool;

var config = {
    user: 'postgres',
    password: 'Javiercarpio1',
    database: 'proyecto2DB'
    
};

var Pool = new Pool(config);

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems, "inicializar");
});

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function getRandom(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    var random = Math.random();
    
    return Math.floor(random * (Math.abs(max - min) + 1)) + min;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

async function graficar(){
    var canvas = document.getElementById('chart');
    var divChart = document.getElementById('grafica');
    divChart.style.display = '';
    var grafica = document.getElementById('chartId').value;
    var titulos = [];
    var datos = [];
    var color = [];
    var r, g, b = 0;
    var textos = '';
    var display = true;

    if(grafica == 'pie' || grafica == 'bar' || grafica == 'horizontalBar' || grafica == 'polarArea'){
        var variable = document.querySelector('input[name=group1]:checked').value;
    }else{
        var variable = document.querySelector('input[name=group2]:checked').value;
    }

    if(grafica == 'bar' || grafica == 'horizontalBar' || grafica == 'line'){
        display = false;
    }else if(grafica == 'pie'){
        display = true;
    }

    if(variable == 'cliente'){
        var query = 'SELECT nombre as "titulo", SUM(total) as "suma" FROM facturas as f JOIN clientes as c ON f.clienteid = c.id GROUP BY nombre;';
        var response = await Pool.query(query);
        textos = 'Ventas por cliente';
    }else if(variable == 'marca'){
        var query = 'SELECT fabricante as "titulo", SUM(precio * cantidad) as "suma" FROM lineas_de_facturas as lf JOIN productos as p ON lf.idproducto = p.id JOIN marcas as m ON m.id = p.idmarca GROUP BY fabricante;';
        var response = await Pool.query(query);
        textos = 'Ventas por marca';
    }else if(variable == 'producto'){
        var query = 'SELECT nombre as "titulo", SUM(precio * cantidad) as "suma" FROM lineas_de_facturas as lf JOIN productos as p ON p.id = lf.idproducto GROUP BY nombre;';
        var response = await Pool.query(query);
        textos = 'Ventas por producto';
    }else if(variable == 'categoria'){
        var query = 'SELECT descripcion as "titulo", SUM(precio * cantidad) as "suma" FROM lineas_de_facturas as lf JOIN productos as p ON p.id = lf.idproducto JOIN categorias as c ON c.id = p.idcategoria GROUP BY descripcion;';
        var response = await Pool.query(query);
        textos = 'Ventas por categoria';
    }else if(variable == 'anio'){
        var query = 'SELECT year_actual as "titulo", SUM(total) as "suma" FROM facturas as f JOIN d_date as d ON f.fecha = d.date_actual GROUP BY year_actual;';
        var response = await Pool.query(query);
        textos = 'Ventas por año';
    }else if(variable == 'mes'){
        var query = 'SELECT month_actual as "titulo", SUM(total) as "suma" FROM facturas as f JOIN d_date as d ON f.fecha = d.date_actual GROUP BY month_actual;';
        var response = await Pool.query(query);
        textos = 'Ventas por mes';
    }else if(variable == 'trimestre'){
        var query = 'SELECT quarter_actual as "titulo", SUM(total) as "suma" FROM facturas as f JOIN d_date as d ON f.fecha = d.date_actual GROUP BY quarter_actual;';
        var response = await Pool.query(query);
        textos = 'Ventas por trimestre';
    }

    if(variable == 'cliente' || variable == 'marca' || variable == 'categoria' || variable == 'producto'){
        for(var i = 0; i < response.rows.length; i++){
            titulos.push(response.rows[i].titulo);
            datos.push(response.rows[i].suma);
    
            r = getRandom(0, 255);
            g = getRandom(0, 255);
            b = getRandom(0, 255);
    
            color.push(rgbToHex(r, g, b));
        }

        new Chart(canvas, {
            type: grafica,
            data: {
            labels: titulos,
            datasets: [
                {
                backgroundColor: color,
                data: datos
                }
            ]},
            options: {
                legend: { display: display },
                title: {
                    display: true,
                    text: textos
                }
            }
        });
    }else if(variable == 'anio' || variable == 'mes' || variable == 'trimestre'){
        if(grafica == 'bar' || grafica == 'horizontalBar' || grafica == 'pie'){
            for(var i = 0; i < response.rows.length; i++){
                titulos.push(response.rows[i].titulo);
                datos.push(response.rows[i].suma);
        
                r = getRandom(0, 255);
                g = getRandom(0, 255);
                b = getRandom(0, 255);
        
                color.push(rgbToHex(r, g, b));
            }
    
            new Chart(canvas, {
                type: grafica,
                data: {
                labels: titulos,
                datasets: [
                    {
                    backgroundColor: color,
                    data: datos
                    }
                ]},
                options: {
                    legend: { display: display },
                    title: {
                        display: true,
                        text: textos
                    }
                }
            });
        }else{
            for(var i = 0; i < response.rows.length; i++){
                titulos.push(response.rows[i].titulo);
                datos.push(response.rows[i].suma);
            }
    
            r = getRandom(0, 255);
            g = getRandom(0, 255);
            b = getRandom(0, 255);
    
            new Chart(canvas, {
                type: grafica,
                data: {
                labels: titulos,
                datasets: [
                    {
                    backgroundColor: rgbToHex(r, g, b),
                    data: datos
                    }
                ]},
                options: {
                    legend: { display: display },
                    title: {
                        display: true,
                        text: textos
                    }
                }
            });
        }
        
    }
    
}

function selectChart(seleccion){
    var divPie = document.getElementById('graficaPie');
    var divDispersion = document.getElementById('graficaDispersion');
    console.log(seleccion.value);
    if(seleccion.value == 'pie' || seleccion.value == 'bar' || seleccion.value == 'horizontalBar'){
        divPie.style.display = '';
        divDispersion.style.display = 'none';
    } else if(seleccion.value == 'line'){
        divPie.style.display = 'none';
        divDispersion.style.display = '';
    }
    else{
        divPie.style.display = 'none';
    }
}