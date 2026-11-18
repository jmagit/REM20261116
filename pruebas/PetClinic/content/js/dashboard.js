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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6119893567068398, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8327444051825678, 500, 1500, "Ver propietario"], "isController": false}, {"data": [0.7919493736951984, 500, 1500, "Enviar mascota"], "isController": false}, {"data": [0.7848662752772342, 500, 1500, "Formulario editar mascota"], "isController": false}, {"data": [0.4928888308977035, 500, 1500, "Editar mascota"], "isController": true}, {"data": [0.7601468798887537, 500, 1500, "Páginar veterinarios"], "isController": false}, {"data": [0.6395863145570444, 500, 1500, "Enviar lastName-0"], "isController": false}, {"data": [0.6395863145570444, 500, 1500, "Enviar lastName"], "isController": false}, {"data": [0.7693770803613885, 500, 1500, "Páginar veterinarios-1"], "isController": false}, {"data": [0.0, 500, 1500, "Busca-pagina-consulta propietarios"], "isController": true}, {"data": [0.7820050408482531, 500, 1500, "Páginar veterinarios-0"], "isController": false}, {"data": [0.8327444051825678, 500, 1500, "Ver propietario-0"], "isController": false}, {"data": [0.8738943808532779, 500, 1500, "Buscar propietarios"], "isController": false}, {"data": [0.8158889468196038, 500, 1500, "Añadir visita-0"], "isController": false}, {"data": [0.6037195994277539, 500, 1500, "Inicio"], "isController": false}, {"data": [0.9976589933671479, 500, 1500, "Inicio-4"], "isController": false}, {"data": [0.9985693848354793, 500, 1500, "Inicio-5"], "isController": false}, {"data": [0.9975289374431006, 500, 1500, "Inicio-6"], "isController": false}, {"data": [0.7848662752772342, 500, 1500, "Formulario editar mascota-0"], "isController": false}, {"data": [0.8925738067368969, 500, 1500, "Inicio-0"], "isController": false}, {"data": [0.9989595526076213, 500, 1500, "Inicio-1"], "isController": false}, {"data": [0.9983092729873846, 500, 1500, "Inicio-2"], "isController": false}, {"data": [0.9920015606710886, 500, 1500, "Inicio-3"], "isController": false}, {"data": [0.9973903966597077, 500, 1500, "Enviar mascota-0"], "isController": false}, {"data": [0.8370955114822547, 500, 1500, "Enviar mascota-1"], "isController": false}, {"data": [0.7872423689016437, 500, 1500, "Formulario nueva mascota-0"], "isController": false}, {"data": [0.7714938030006523, 500, 1500, "Lista veterinarios-0"], "isController": false}, {"data": [0.8158889468196038, 500, 1500, "Añadir visita"], "isController": false}, {"data": [0.8738943808532779, 500, 1500, "Buscar propietarios-0"], "isController": false}, {"data": [0.7714938030006523, 500, 1500, "Lista veterinarios"], "isController": false}, {"data": [0.7872423689016437, 500, 1500, "Formulario nueva mascota"], "isController": false}, {"data": [0.0019942128724485804, 500, 1500, "Páginar propietarios"], "isController": false}, {"data": [0.007246943510336019, 500, 1500, "Páginar propietarios-0"], "isController": false}, {"data": [0.0024752475247524753, 500, 1500, "Páginar propietarios-1"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 316923, 0, 0.0, 1133.9451822682563, 1, 19314, 255.5, 4099.9000000000015, 4518.9000000000015, 7425.94000000017, 87.99635267844623, 2555.5480660680328, 50.60621616644875], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Ver propietario", 7641, 0, 0.0, 446.7040963224701, 28, 3434, 354.0, 871.0, 1075.8999999999996, 1496.8999999999996, 2.134339060192495, 11.287598934635621, 1.0333011082864925], "isController": false}, {"data": ["Enviar mascota", 7664, 0, 0.0, 514.5554540709832, 32, 4437, 411.0, 1011.0, 1215.75, 1715.1000000000022, 2.1321653162582055, 11.67438875429549, 2.6671665798318416], "isController": false}, {"data": ["Formulario editar mascota", 7665, 0, 0.0, 527.7916503587759, 32, 4188, 415.0, 1053.0, 1243.0, 1699.3400000000001, 2.131215001084376, 9.879763291159698, 1.052400362570693], "isController": false}, {"data": ["Editar mascota", 7664, 0, 0.0, 1042.3716075156497, 93, 5707, 941.0, 1832.5, 2131.0, 2856.4000000000015, 2.131194723179662, 21.54874368848379, 3.718342701686964], "isController": true}, {"data": ["Páginar veterinarios", 23012, 0, 0.0, 575.7197983660752, 51, 4398, 468.0, 996.0, 1195.0, 1679.0, 6.397927040500001, 29.392696117579842, 3.3951396918328567], "isController": false}, {"data": ["Enviar lastName-0", 7687, 0, 0.0, 731.3239235072174, 127, 4617, 615.0, 1258.0, 1516.0, 2147.24, 2.138088175902325, 11.645508382911233, 1.0457740259210162], "isController": false}, {"data": ["Enviar lastName", 7687, 0, 0.0, 731.3239235072174, 127, 4617, 615.0, 1258.0, 1516.0, 2147.24, 2.138088175902325, 11.645508382911233, 1.0457740259210162], "isController": false}, {"data": ["Páginar veterinarios-1", 2103, 0, 0.0, 559.3014740846409, 57, 3175, 464.0, 1009.0, 1183.7999999999997, 1599.96, 0.5855601371374601, 2.664184256761159, 0.28464466037999314], "isController": false}, {"data": ["Busca-pagina-consulta propietarios", 7641, 0, 0.0, 18289.83667059281, 9677, 49172, 17252.0, 23681.800000000003, 27753.899999999994, 33561.22, 2.124729195047137, 214.6487466894086, 8.364596167979572], "isController": true}, {"data": ["Páginar veterinarios-0", 23012, 0, 0.0, 524.5985138188789, 1, 4398, 439.0, 965.0, 1166.9500000000007, 1651.9900000000016, 6.397927040500001, 26.73247985312946, 3.1109189765388026], "isController": false}, {"data": ["Ver propietario-0", 7641, 0, 0.0, 446.7040963224701, 28, 3434, 354.0, 871.0, 1075.8999999999996, 1496.8999999999996, 2.134339060192495, 11.287598934635621, 1.0333011082864925], "isController": false}, {"data": ["Buscar propietarios", 7688, 0, 0.0, 387.9871227887608, 36, 3431, 305.0, 736.0, 905.0999999999985, 1328.659999999998, 2.13765401925112, 7.208319656713007, 1.0434741593379446], "isController": false}, {"data": ["Añadir visita-0", 7672, 0, 0.0, 474.7978362877976, 29, 3591, 373.0, 946.6999999999998, 1142.0, 1552.539999999999, 2.133440709841774, 10.346354067455325, 1.0643058803411447], "isController": false}, {"data": ["Inicio", 7689, 0, 0.0, 800.0430485108636, 68, 4230, 725.0, 1354.0, 1587.5, 2251.1000000000004, 2.1359484372213395, 982.3819254730324, 6.71361021564426], "isController": false}, {"data": ["Inicio-4", 7689, 0, 0.0, 78.19976589933682, 4, 1687, 49.0, 181.0, 247.0, 406.0, 2.13788689246504, 141.90433026753547, 0.9471326467896107], "isController": false}, {"data": ["Inicio-5", 7689, 0, 0.0, 65.24346468981666, 3, 1307, 38.0, 157.0, 219.0, 372.2000000000007, 2.1378964033625785, 17.090644490162173, 0.9617513865289727], "isController": false}, {"data": ["Inicio-6", 7689, 0, 0.0, 72.26427363766405, 4, 1749, 44.0, 168.0, 233.5, 405.10000000000036, 2.13791423652355, 168.59040488210607, 1.0097789669792487], "isController": false}, {"data": ["Formulario editar mascota-0", 7665, 0, 0.0, 527.7916503587759, 32, 4188, 415.0, 1053.0, 1243.0, 1699.3400000000001, 2.131215001084376, 9.879763291159698, 1.052400362570693], "isController": false}, {"data": ["Inicio-0", 7689, 0, 0.0, 351.88633112238284, 25, 2755, 273.0, 685.0, 855.0, 1232.4000000000015, 2.136045157811483, 5.9679933559557155, 0.8941671763526272], "isController": false}, {"data": ["Inicio-1", 7689, 0, 0.0, 48.055403823644134, 3, 1329, 26.0, 114.0, 161.0, 299.0, 2.1367586685456286, 1.615089071732731, 0.9528928530264913], "isController": false}, {"data": ["Inicio-2", 7689, 0, 0.0, 59.641175705553366, 3, 1460, 35.0, 140.0, 196.5, 369.2000000000007, 2.1367954848558197, 65.2035630032127, 1.0009037011873958], "isController": false}, {"data": ["Inicio-3", 7689, 0, 0.0, 120.3953700091034, 6, 1169, 80.0, 279.0, 362.5, 543.3000000000011, 2.1371702520576763, 582.668997850791, 0.9509893193950771], "isController": false}, {"data": ["Enviar mascota-0", 7664, 0, 0.0, 77.81693632567864, 4, 2018, 44.0, 185.0, 253.75, 412.35000000000036, 2.1322566698401975, 0.41182612923495276, 1.4235608267321664], "isController": false}, {"data": ["Enviar mascota-1", 7664, 0, 0.0, 436.63282881002027, 26, 4130, 333.0, 872.5, 1070.0, 1507.050000000001, 2.133364212926673, 11.268913113008178, 1.2443660457994103], "isController": false}, {"data": ["Formulario nueva mascota-0", 7666, 0, 0.0, 525.6377511087918, 32, 3784, 411.0, 1053.0, 1252.6499999999996, 1714.9899999999998, 2.1323586679573197, 9.801769775463967, 1.040816437847002], "isController": false}, {"data": ["Lista veterinarios-0", 7665, 0, 0.0, 562.1440313111528, 63, 4777, 454.0, 999.4000000000005, 1212.0, 1761.3600000000006, 2.132025950357869, 9.700301662809874, 1.0031769690017613], "isController": false}, {"data": ["Añadir visita", 7672, 0, 0.0, 474.7978362877976, 29, 3591, 373.0, 946.6999999999998, 1142.0, 1552.539999999999, 2.133440709841774, 10.346354067455325, 1.0643058803411447], "isController": false}, {"data": ["Buscar propietarios-0", 7688, 0, 0.0, 387.9871227887608, 36, 3431, 305.0, 736.0, 905.0999999999985, 1328.659999999998, 2.13765401925112, 7.208319656713007, 1.0434741593379446], "isController": false}, {"data": ["Lista veterinarios", 7665, 0, 0.0, 562.1440313111528, 63, 4777, 454.0, 999.4000000000005, 1212.0, 1761.3600000000006, 2.132025950357869, 9.700301662809874, 1.0031769690017613], "isController": false}, {"data": ["Formulario nueva mascota", 7666, 0, 0.0, 525.6377511087918, 32, 3784, 411.0, 1053.0, 1252.6499999999996, 1714.9899999999998, 2.1323586679573197, 9.801769775463967, 1.040816437847002], "isController": false}, {"data": ["Páginar propietarios", 38361, 0, 0.0, 3344.960428560248, 790, 19314, 3410.0, 4954.0, 6052.800000000003, 8501.700000000048, 10.667235422751874, 185.43198195555624, 5.281020529461074], "isController": false}, {"data": ["Páginar propietarios-0", 38361, 0, 0.0, 3326.8423398764658, 5, 19314, 3400.0, 4943.9000000000015, 6043.0, 8501.700000000048, 10.667235422751874, 184.45726984922007, 5.253443037863805], "isController": false}, {"data": ["Páginar propietarios-1", 202, 0, 0.0, 3440.623762376237, 1467, 15028, 3163.5, 4899.8, 5590.199999999999, 10417.939999999997, 0.05660636967378198, 0.982264240950617, 0.027791163847277135], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 316923, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
