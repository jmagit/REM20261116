/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.639777075406855, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8566980023501762, 500, 1500, "Ver propietario"], "isController": false}, {"data": [0.824736225087925, 500, 1500, "Enviar mascota"], "isController": false}, {"data": [0.8212192262602579, 500, 1500, "Formulario editar mascota"], "isController": false}, {"data": [0.5698124267291911, 500, 1500, "Editar mascota"], "isController": true}, {"data": [0.8192832297651151, 500, 1500, "Páginar veterinarios"], "isController": false}, {"data": [0.7301754385964913, 500, 1500, "Enviar lastName-0"], "isController": false}, {"data": [0.7301754385964913, 500, 1500, "Enviar lastName"], "isController": false}, {"data": [0.82542446669569, 500, 1500, "Páginar veterinarios-1"], "isController": false}, {"data": [0.0, 500, 1500, "Busca-pagina-consulta propietarios"], "isController": true}, {"data": [0.835521944737562, 500, 1500, "Páginar veterinarios-0"], "isController": false}, {"data": [0.8566980023501762, 500, 1500, "Ver propietario-0"], "isController": false}, {"data": [0.8865497076023392, 500, 1500, "Buscar propietarios"], "isController": false}, {"data": [0.841540626099191, 500, 1500, "Añadir visita-0"], "isController": false}, {"data": [0.6847673602992752, 500, 1500, "Inicio"], "isController": false}, {"data": [0.9957914425999532, 500, 1500, "Inicio-4"], "isController": false}, {"data": [0.9965513210194061, 500, 1500, "Inicio-5"], "isController": false}, {"data": [0.9954407294832827, 500, 1500, "Inicio-6"], "isController": false}, {"data": [0.8212192262602579, 500, 1500, "Formulario editar mascota-0"], "isController": false}, {"data": [0.8950783259293897, 500, 1500, "Inicio-0"], "isController": false}, {"data": [0.9977203647416414, 500, 1500, "Inicio-1"], "isController": false}, {"data": [0.9967851297638531, 500, 1500, "Inicio-2"], "isController": false}, {"data": [0.9874327799859715, 500, 1500, "Inicio-3"], "isController": false}, {"data": [0.9967760844079718, 500, 1500, "Enviar mascota-0"], "isController": false}, {"data": [0.8557444314185229, 500, 1500, "Enviar mascota-1"], "isController": false}, {"data": [0.8246539995308468, 500, 1500, "Formulario nueva mascota-0"], "isController": false}, {"data": [0.8300902590552104, 500, 1500, "Lista veterinarios-0"], "isController": false}, {"data": [0.841540626099191, 500, 1500, "Añadir visita"], "isController": false}, {"data": [0.8865497076023392, 500, 1500, "Buscar propietarios-0"], "isController": false}, {"data": [0.8300902590552104, 500, 1500, "Lista veterinarios"], "isController": false}, {"data": [0.8246539995308468, 500, 1500, "Formulario nueva mascota"], "isController": false}, {"data": [0.010357594788395744, 500, 1500, "Páginar propietarios"], "isController": false}, {"data": [0.015208323569386511, 500, 1500, "Páginar propietarios-0"], "isController": false}, {"data": [0.011961722488038277, 500, 1500, "Páginar propietarios-1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 352502, 0, 0.0, 1019.4620370948219, 1, 21608, 451.0, 2798.0, 3662.9000000000015, 4815.900000000016, 97.88464838645362, 2843.191257443183, 56.29024300993031], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Ver propietario", 8510, 0, 0.0, 406.15334900117335, 29, 2915, 251.0, 978.0, 1241.4499999999998, 1702.1199999999953, 2.3672187766346884, 12.462827267648159, 1.1460687882378155], "isController": false}, {"data": ["Enviar mascota", 8530, 0, 0.0, 465.61758499413924, 33, 3938, 292.0, 1107.7000000000016, 1376.0, 1912.4500000000025, 2.369814398803369, 12.975414549524814, 2.964460181006035], "isController": false}, {"data": ["Formulario editar mascota", 8530, 0, 0.0, 487.23739742086656, 31, 4119, 307.0, 1184.0, 1439.4499999999998, 1949.6900000000005, 2.370135734033538, 10.98733821236055, 1.1704612847149864], "isController": false}, {"data": ["Editar mascota", 8530, 0, 0.0, 952.855216881596, 74, 7544, 728.5, 1963.0, 2321.45, 3136.0, 2.369781480032716, 23.960930291943605, 4.134705342989059], "isController": true}, {"data": ["Páginar veterinarios", 25587, 0, 0.0, 523.1067338883063, 45, 6206, 362.0, 1073.9000000000015, 1333.0, 1851.9900000000016, 7.108522837452723, 32.65767650734189, 3.766714677191746], "isController": false}, {"data": ["Enviar lastName-0", 8550, 0, 0.0, 653.2167251462007, 63, 7187, 486.0, 1265.800000000001, 1583.4499999999998, 2239.409999999998, 2.375331886649718, 12.945951360964463, 1.1618333408806842], "isController": false}, {"data": ["Enviar lastName", 8550, 0, 0.0, 653.2167251462007, 63, 7187, 486.0, 1265.800000000001, 1583.4499999999998, 2239.409999999998, 2.375331886649718, 12.945951360964463, 1.1618333408806842], "isController": false}, {"data": ["Páginar veterinarios-1", 2297, 0, 0.0, 510.1501959077049, 62, 5610, 349.0, 1045.4000000000005, 1329.1999999999998, 1835.06, 0.6386967361123083, 2.905945403854731, 0.3104866615576026], "isController": false}, {"data": ["Busca-pagina-consulta propietarios", 8510, 0, 0.0, 16395.18072855457, 4106, 39130, 16168.0, 19954.800000000003, 21629.25, 28936.339999999997, 2.3642238205968065, 238.79774379712475, 9.305530794379898], "isController": true}, {"data": ["Páginar veterinarios-0", 25587, 0, 0.0, 477.3009731504275, 1, 6206, 341.0, 1036.0, 1301.0, 1814.9800000000032, 7.108522837452723, 29.754230576180824, 3.4564950725896115], "isController": false}, {"data": ["Ver propietario-0", 8510, 0, 0.0, 406.15334900117335, 29, 2915, 251.0, 978.0, 1241.4499999999998, 1702.1199999999953, 2.3672187766346884, 12.462827267648159, 1.1460687882378155], "isController": false}, {"data": ["Buscar propietarios", 8550, 0, 0.0, 353.9955555555548, 27, 4579, 218.0, 816.9000000000005, 1049.0, 1523.9199999999983, 2.375921329493326, 8.011773780019976, 1.159801416222791], "isController": false}, {"data": ["Añadir visita-0", 8529, 0, 0.0, 439.533239535702, 28, 4836, 270.0, 1066.0, 1341.5, 1850.7000000000007, 2.3698927754809325, 11.493054221717099, 1.182272499914557], "isController": false}, {"data": ["Inicio", 8554, 0, 0.0, 713.2035305120413, 70, 5605, 564.0, 1440.5, 1729.0, 2387.4500000000007, 2.376192957757434, 1092.8770434992066, 7.469301329754136], "isController": false}, {"data": ["Inicio-4", 8554, 0, 0.0, 69.62426934767367, 4, 1567, 27.0, 195.0, 290.0, 485.0, 2.3767534947640017, 157.75933426329533, 1.0530368911166823], "isController": false}, {"data": ["Inicio-5", 8554, 0, 0.0, 57.62228197334582, 3, 1627, 22.0, 152.0, 241.0, 460.4500000000007, 2.376751513602276, 19.000085830418193, 1.0692833381494458], "isController": false}, {"data": ["Inicio-6", 8554, 0, 0.0, 61.61433247603425, 4, 1564, 28.0, 156.5, 245.0, 484.0, 2.3767336832953747, 187.423090748146, 1.1226589831378053], "isController": false}, {"data": ["Formulario editar mascota-0", 8530, 0, 0.0, 487.23739742086656, 31, 4119, 307.0, 1184.0, 1439.4499999999998, 1949.6900000000005, 2.370135734033538, 10.98733821236055, 1.1704612847149864], "isController": false}, {"data": ["Inicio-0", 8554, 0, 0.0, 325.7570727145191, 19, 3094, 196.0, 759.0, 982.0, 1452.9000000000015, 2.3762787707799387, 6.639192932813871, 0.9948119429815325], "isController": false}, {"data": ["Inicio-1", 8554, 0, 0.0, 42.371522094926235, 3, 1639, 17.0, 101.0, 172.0, 386.0, 2.376347425660663, 1.7961844799427278, 1.0598189347718467], "isController": false}, {"data": ["Inicio-2", 8554, 0, 0.0, 52.47287818564436, 2, 1618, 23.0, 128.0, 211.0, 441.90000000000146, 2.376345445175844, 72.51334582559531, 1.1131929980248052], "isController": false}, {"data": ["Inicio-3", 8554, 0, 0.0, 102.01847089081149, 7, 2165, 43.0, 282.5, 394.0, 629.4500000000007, 2.3765164391926845, 647.9233232200922, 1.0575734956948213], "isController": false}, {"data": ["Enviar mascota-0", 8530, 0, 0.0, 65.07678780773706, 4, 1278, 23.0, 192.0, 268.0, 434.380000000001, 2.3701093918015887, 0.45758280448125727, 1.582439947561677], "isController": false}, {"data": ["Enviar mascota-1", 8530, 0, 0.0, 400.4490035169989, 26, 3866, 234.0, 969.0, 1226.8999999999996, 1730.760000000002, 2.36982361622304, 12.517937386040794, 1.38222256620087], "isController": false}, {"data": ["Formulario nueva mascota-0", 8526, 0, 0.0, 481.5414027680038, 31, 4975, 299.0, 1168.0, 1457.0, 1952.9499999999935, 2.369543775278538, 10.892033740464921, 1.1567017216398876], "isController": false}, {"data": ["Lista veterinarios-0", 8531, 0, 0.0, 502.93939749150206, 42, 4053, 345.0, 1050.8000000000002, 1326.3999999999996, 1880.3600000000006, 2.370175189036127, 10.783834185272768, 1.1153037502375454], "isController": false}, {"data": ["Añadir visita", 8529, 0, 0.0, 439.533239535702, 28, 4836, 270.0, 1066.0, 1341.5, 1850.7000000000007, 2.3698927754809325, 11.493054221717099, 1.182272499914557], "isController": false}, {"data": ["Buscar propietarios-0", 8550, 0, 0.0, 353.9955555555548, 27, 4579, 218.0, 816.9000000000005, 1049.0, 1523.9199999999983, 2.375921329493326, 8.011773780019976, 1.159801416222791], "isController": false}, {"data": ["Lista veterinarios", 8531, 0, 0.0, 502.939397491502, 42, 4053, 345.0, 1050.8000000000002, 1326.3999999999996, 1880.3600000000006, 2.370175189036127, 10.783834185272768, 1.1153037502375454], "isController": false}, {"data": ["Formulario nueva mascota", 8526, 0, 0.0, 481.5414027680038, 31, 4975, 299.0, 1168.0, 1457.0, 1952.9499999999935, 2.369543775278538, 10.892033740464921, 1.1567017216398876], "isController": false}, {"data": ["Páginar propietarios", 42674, 0, 0.0, 2996.2681960912955, 469, 21608, 2913.0, 4079.0, 4509.0, 5718.890000000018, 11.853342318104222, 206.05342128234503, 5.866291998757835], "isController": false}, {"data": ["Páginar propietarios-0", 42674, 0, 0.0, 2982.512419740316, 5, 21608, 2909.0, 4077.0, 4506.0, 5707.980000000003, 11.853342318104222, 205.0435052855896, 5.837775789800387], "isController": false}, {"data": ["Páginar propietarios-1", 209, 0, 0.0, 2808.559808612438, 957, 7213, 2750.0, 3944.0, 4381.0, 6157.6, 0.05900291288064642, 1.0264432520076519, 0.028982876151333156], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 352502, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
