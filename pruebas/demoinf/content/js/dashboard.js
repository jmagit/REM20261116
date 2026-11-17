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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.967391304347826, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "petclinic-113"], "isController": false}, {"data": [0.5, 500, 1500, "propietarios"], "isController": true}, {"data": [1.0, 500, 1500, "petclinic-112"], "isController": false}, {"data": [1.0, 500, 1500, "petclinic-114"], "isController": false}, {"data": [1.0, 500, 1500, "petclinic-111"], "isController": false}, {"data": [0.5, 500, 1500, "Inico"], "isController": true}, {"data": [0.5, 500, 1500, "inicio"], "isController": false}, {"data": [1.0, 500, 1500, "inicio-2"], "isController": false}, {"data": [1.0, 500, 1500, "inicio-3"], "isController": false}, {"data": [1.0, 500, 1500, "inicio-0"], "isController": false}, {"data": [1.0, 500, 1500, "inicio-1"], "isController": false}, {"data": [1.0, 500, 1500, "inicio-6"], "isController": false}, {"data": [1.0, 500, 1500, "inicio-4"], "isController": false}, {"data": [1.0, 500, 1500, "inicio-5"], "isController": false}, {"data": [1.0, 500, 1500, "petclinic-104-0"], "isController": false}, {"data": [1.0, 500, 1500, "petclinic-104-1"], "isController": false}, {"data": [1.0, 500, 1500, "petclinic-104-4"], "isController": false}, {"data": [1.0, 500, 1500, "petclinic-104-5"], "isController": false}, {"data": [1.0, 500, 1500, "petclinic-104-2"], "isController": false}, {"data": [1.0, 500, 1500, "petclinic-104-3"], "isController": false}, {"data": [1.0, 500, 1500, "petclinic-104"], "isController": false}, {"data": [1.0, 500, 1500, "petclinic-111-1"], "isController": false}, {"data": [1.0, 500, 1500, "petclinic-112-0"], "isController": false}, {"data": [1.0, 500, 1500, "petclinic-111-0"], "isController": false}, {"data": [1.0, 500, 1500, "editar"], "isController": true}, {"data": [1.0, 500, 1500, "petclinic-111-5"], "isController": false}, {"data": [1.0, 500, 1500, "petclinic-113-3"], "isController": false}, {"data": [1.0, 500, 1500, "petclinic-112-4"], "isController": false}, {"data": [1.0, 500, 1500, "petclinic-114-2"], "isController": false}, {"data": [1.0, 500, 1500, "petclinic-111-4"], "isController": false}, {"data": [1.0, 500, 1500, "petclinic-113-2"], "isController": false}, {"data": [1.0, 500, 1500, "petclinic-112-3"], "isController": false}, {"data": [1.0, 500, 1500, "petclinic-114-1"], "isController": false}, {"data": [1.0, 500, 1500, "petclinic-111-3"], "isController": false}, {"data": [1.0, 500, 1500, "petclinic-113-1"], "isController": false}, {"data": [1.0, 500, 1500, "petclinic-112-2"], "isController": false}, {"data": [1.0, 500, 1500, "petclinic-114-0"], "isController": false}, {"data": [1.0, 500, 1500, "petclinic-111-2"], "isController": false}, {"data": [1.0, 500, 1500, "petclinic-113-0"], "isController": false}, {"data": [1.0, 500, 1500, "petclinic-112-1"], "isController": false}, {"data": [1.0, 500, 1500, "petclinic-114-5"], "isController": false}, {"data": [1.0, 500, 1500, "petclinic-113-5"], "isController": false}, {"data": [1.0, 500, 1500, "petclinic-114-4"], "isController": false}, {"data": [1.0, 500, 1500, "petclinic-113-4"], "isController": false}, {"data": [1.0, 500, 1500, "petclinic-112-5"], "isController": false}, {"data": [1.0, 500, 1500, "petclinic-114-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 129, 0, 0.0, 82.71317829457367, 3, 1146, 10.0, 368.0, 425.0, 1120.499999999999, 53.41614906832298, 6122.896447981367, 40.802115683229815], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["petclinic-113", 3, 0, 0.0, 404.0, 367, 437, 408.0, 437.0, 437.0, 437.0, 3.468208092485549, 1415.5132315751446, 9.503703034682081], "isController": false}, {"data": ["propietarios", 3, 0, 0.0, 1139.6666666666667, 1132, 1146, 1141.0, 1146.0, 1146.0, 1146.0, 2.5795356835769563, 4143.542931803525, 28.097793959587275], "isController": true}, {"data": ["petclinic-112", 3, 0, 0.0, 437.6666666666667, 403, 474, 436.0, 474.0, 474.0, 474.0, 3.5971223021582737, 1468.1984880845325, 9.93424010791367], "isController": false}, {"data": ["petclinic-114", 3, 0, 0.0, 100.0, 79, 124, 97.0, 124.0, 124.0, 124.0, 22.388059701492537, 8915.476329291045, 61.50157416044776], "isController": false}, {"data": ["petclinic-111", 3, 0, 0.0, 152.33333333333334, 119, 175, 163.0, 175.0, 175.0, 175.0, 15.544041450777202, 6153.649206606217, 42.44251943005181], "isController": false}, {"data": ["Inico", 3, 0, 0.0, 922.6666666666666, 561, 1146, 1061.0, 1146.0, 1146.0, 1146.0, 2.1474588403722263, 987.6758791159627, 5.976814155332856], "isController": true}, {"data": ["inicio", 3, 0, 0.0, 922.6666666666666, 561, 1146, 1061.0, 1146.0, 1146.0, 1146.0, 2.617801047120419, 1203.999304646597, 7.285872054973822], "isController": false}, {"data": ["inicio-2", 3, 0, 0.0, 3.6666666666666665, 3, 4, 4.0, 4.0, 4.0, 4.0, 11.363636363636363, 346.7573686079545, 4.7385475852272725], "isController": false}, {"data": ["inicio-3", 3, 0, 0.0, 10.333333333333334, 10, 11, 10.0, 11.0, 11.0, 11.0, 272.7272727272727, 74355.20241477274, 107.3330965909091], "isController": false}, {"data": ["inicio-0", 3, 0, 0.0, 163.33333333333334, 25, 275, 190.0, 275.0, 275.0, 275.0, 5.0675675675675675, 14.158506651182433, 1.8607474662162162], "isController": false}, {"data": ["inicio-1", 3, 0, 0.0, 4.333333333333333, 3, 5, 5.0, 5.0, 5.0, 5.0, 11.320754716981131, 8.55689858490566, 4.466391509433962], "isController": false}, {"data": ["inicio-6", 3, 0, 0.0, 15.0, 8, 21, 16.0, 21.0, 21.0, 21.0, 115.38461538461539, 9098.93329326923, 48.56520432692308], "isController": false}, {"data": ["inicio-4", 3, 0, 0.0, 9.333333333333334, 8, 10, 10.0, 10.0, 10.0, 10.0, 300.0, 19912.79296875, 117.48046875], "isController": false}, {"data": ["inicio-5", 3, 0, 0.0, 13.333333333333334, 10, 18, 12.0, 18.0, 18.0, 18.0, 150.0, 1199.12109375, 59.765625], "isController": false}, {"data": ["petclinic-104-0", 3, 0, 0.0, 69.66666666666667, 54, 98, 57.0, 98.0, 98.0, 98.0, 26.31578947368421, 88.73869243421052, 11.076274671052632], "isController": false}, {"data": ["petclinic-104-1", 3, 0, 0.0, 13.333333333333334, 6, 18, 16.0, 18.0, 18.0, 18.0, 38.96103896103896, 29.449066558441558, 17.045454545454547], "isController": false}, {"data": ["petclinic-104-4", 3, 0, 0.0, 10.0, 6, 14, 10.0, 14.0, 14.0, 14.0, 38.46153846153847, 307.46694711538464, 16.97716346153846], "isController": false}, {"data": ["petclinic-104-5", 3, 0, 0.0, 13.666666666666666, 12, 15, 14.0, 15.0, 15.0, 15.0, 38.96103896103896, 3072.367086038961, 18.072747564935064], "isController": false}, {"data": ["petclinic-104-2", 3, 0, 0.0, 11.333333333333334, 5, 15, 14.0, 15.0, 15.0, 15.0, 40.0, 1220.5859375, 18.3984375], "isController": false}, {"data": ["petclinic-104-3", 3, 0, 0.0, 20.666666666666668, 16, 28, 18.0, 28.0, 28.0, 28.0, 34.090909090909086, 9294.400301846592, 14.881480823863637], "isController": false}, {"data": ["petclinic-104", 3, 0, 0.0, 145.66666666666666, 126, 172, 139.0, 172.0, 172.0, 172.0, 15.957446808510637, 6289.306640625, 42.449301861702125], "isController": false}, {"data": ["petclinic-111-1", 3, 0, 0.0, 7.333333333333333, 6, 10, 6.0, 10.0, 10.0, 10.0, 300.0, 226.7578125, 134.47265625], "isController": false}, {"data": ["petclinic-112-0", 3, 0, 0.0, 386.6666666666667, 368, 414, 378.0, 414.0, 414.0, 414.0, 3.7546933667083855, 65.3367979505632, 1.6500117334167708], "isController": false}, {"data": ["petclinic-111-0", 3, 0, 0.0, 83.0, 72, 102, 75.0, 102.0, 102.0, 102.0, 21.897810218978105, 112.2690465328467, 9.58029197080292], "isController": false}, {"data": ["editar", 3, 0, 0.0, 100.0, 79, 124, 97.0, 124.0, 124.0, 124.0, 22.22222222222222, 8849.435763888889, 61.04600694444444], "isController": true}, {"data": ["petclinic-111-5", 3, 0, 0.0, 7.333333333333333, 5, 10, 7.0, 10.0, 10.0, 10.0, 130.43478260869566, 10285.750679347826, 61.905570652173914], "isController": false}, {"data": ["petclinic-113-3", 3, 0, 0.0, 11.333333333333334, 8, 17, 9.0, 17.0, 17.0, 17.0, 6.802721088435374, 1854.6649128401361, 3.0559098639455784], "isController": false}, {"data": ["petclinic-112-4", 3, 0, 0.0, 6.333333333333333, 4, 8, 7.0, 8.0, 8.0, 8.0, 7.614213197969543, 60.86909105329949, 3.48736913071066], "isController": false}, {"data": ["petclinic-114-2", 3, 0, 0.0, 14.666666666666666, 6, 31, 7.0, 31.0, 31.0, 31.0, 71.42857142857143, 2179.617745535714, 33.90066964285714], "isController": false}, {"data": ["petclinic-111-4", 3, 0, 0.0, 5.0, 4, 6, 5.0, 6.0, 6.0, 6.0, 176.47058823529412, 1410.7306985294117, 79.79090073529412], "isController": false}, {"data": ["petclinic-113-2", 3, 0, 0.0, 3.6666666666666665, 3, 4, 4.0, 4.0, 4.0, 4.0, 6.864988558352402, 209.4827123855835, 3.244779748283753], "isController": false}, {"data": ["petclinic-112-3", 3, 0, 0.0, 11.0, 7, 15, 11.0, 15.0, 15.0, 15.0, 7.5, 2044.76806640625, 3.3984375], "isController": false}, {"data": ["petclinic-114-1", 3, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 176.47058823529412, 133.38694852941177, 79.79090073529412], "isController": false}, {"data": ["petclinic-111-3", 3, 0, 0.0, 11.0, 9, 15, 9.0, 15.0, 15.0, 15.0, 150.0, 40895.361328125, 67.08984375], "isController": false}, {"data": ["petclinic-113-1", 3, 0, 0.0, 4.0, 3, 5, 4.0, 5.0, 5.0, 5.0, 6.864988558352402, 5.188965961098398, 3.0905856693363845], "isController": false}, {"data": ["petclinic-112-2", 3, 0, 0.0, 5.666666666666667, 4, 7, 6.0, 7.0, 7.0, 7.0, 7.481296758104738, 228.28914043017454, 3.5653054862842892], "isController": false}, {"data": ["petclinic-114-0", 3, 0, 0.0, 50.666666666666664, 35, 59, 58.0, 59.0, 59.0, 59.0, 43.47826086956522, 324.6433423913043, 18.894361413043477], "isController": false}, {"data": ["petclinic-111-2", 3, 0, 0.0, 6.0, 5, 7, 6.0, 7.0, 7.0, 7.0, 300.0, 9154.39453125, 141.2109375], "isController": false}, {"data": ["petclinic-113-0", 3, 0, 0.0, 364.0, 333, 391, 368.0, 391.0, 391.0, 391.0, 3.6363636363636362, 63.20667613636364, 1.590909090909091], "isController": false}, {"data": ["petclinic-112-1", 3, 0, 0.0, 6.666666666666667, 5, 10, 5.0, 10.0, 10.0, 10.0, 7.371007371007371, 5.571445024570025, 3.3471859643734647], "isController": false}, {"data": ["petclinic-114-5", 3, 0, 0.0, 7.666666666666667, 6, 9, 8.0, 9.0, 9.0, 9.0, 65.21739130434783, 5142.875339673913, 31.207540760869566], "isController": false}, {"data": ["petclinic-113-5", 3, 0, 0.0, 8.666666666666666, 6, 12, 8.0, 12.0, 12.0, 12.0, 6.8807339449541285, 542.5969395068807, 3.279099770642202], "isController": false}, {"data": ["petclinic-114-4", 3, 0, 0.0, 6.333333333333333, 5, 9, 5.0, 9.0, 9.0, 9.0, 68.18181818181817, 545.0550426136364, 31.09463778409091], "isController": false}, {"data": ["petclinic-113-4", 3, 0, 0.0, 7.0, 6, 8, 7.0, 8.0, 8.0, 8.0, 6.960556844547564, 55.64367024361949, 3.1607997389791183], "isController": false}, {"data": ["petclinic-112-5", 3, 0, 0.0, 6.666666666666667, 6, 7, 7.0, 7.0, 7.0, 7.0, 7.633587786259541, 601.965052480916, 3.667700381679389], "isController": false}, {"data": ["petclinic-114-3", 3, 0, 0.0, 9.666666666666666, 9, 10, 10.0, 10.0, 10.0, 10.0, 63.82978723404255, 17402.281416223403, 28.79820478723404], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 129, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
