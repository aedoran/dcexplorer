import { generateChartOptions, buildChartOptions } from './chartOptions.js'
import { grps, grpMaker } from './groups.js'
import { dims } from './dims.js'
import { crossDims } from './cross.js'

const charts = ko.observableArray();

function addChart(chartData) {
  var ci = charts().findIndex(function(d) { return d['name'] == chartData['name'] });

  if (ci == -1) {
    charts.push(chartData);
  } else {
    $("#chart_"+chartData['name']).remove();
    charts()[ci] = chartData;
  }

  var gi = grps().findIndex(function(d) { return d['name'] == chartData['grp'] });
  var grpObj = grps()[gi];
  var dim = crossDims[chartData['dim']];
  var grp = grpMaker(dim,grpObj);

  var html = chartTemplate(chartData)
  $("#graphContainer").append(html);



  var selector = "#chart_"+chartData['name']+" .card-body";
  var chart = dc[chartData['chartType']](selector);


  if (chartData['chartType'] != 'numberDisplay') {
    chart.dimension(dim);
  }

    chart.group(grp)
        .width($(selector).width())
        .height(parseInt(chartData['height']));

  if (chartData['options']) {
      Object.keys(chartData['options']).forEach(function(o) {
        if (o == "xAxis") {
            Object.keys(chartData['options'][o]).forEach(function(ox) {
                var get_func = "(function a() { return "+chartData['options'][o][ox]+ " })()";
                chart.xAxis()[ox](eval(get_func));
            });
        } else if (o == "yAxis") {
            Object.keys(chartData['options'][o]).forEach(function(oy) {
                var get_func = "(function a() { return "+chartData['options'][o][oy]+ " })()";
                chart.yAxis()[oy](eval(get_func));
            });
        } else {
            var get_func = "(function a() { return "+chartData['options'][o]+ " })()";
            chart[o](eval(get_func));
        }
      });
  }

  chart.render();
  $(".chartEditButton").click(function() { editChart($(this).attr('cid')) });
  $(".chartRemoveButton").click(function() { removeChart($(this).attr('cid')) });
  dc.renderAll();
}

function chartTemplate(c) {
    return `
            <div class='col-${c.width}' id='chart_${c.name}'>
                <div class='card'>
                    <div class="bid-clipboard">
                        <div class='btn-group btn-clipboard' role='group'>
                            <button type='button' class='btn chartEditButton' cid='${c.name}'>edit</button>
                            <button type='button' class='btn chartRemoveButton' cid='${c.name}'>remove</button>
                        </div>
                    </div>
                    <div class="card-body">
                    </div>
                </div>
            </div>`
}

function initChartBindings() {
    $(document).ready( function () {
        $("#addChartButton").click(function() {
            addChart(buildChartObj())
        });
        $("#chartType").on('change',generateChartOptions);
        generateChartOptions();
        function dimViewModel() {
            this.dims = dims;
            this.chosenDim = ko.observable();
        }
        function grpViewModel() {
            this.grps = grps;
            this.chosenGrp = ko.observable();
        }

        ko.applyBindings(new dimViewModel(),document.getElementById("chartDim"));
        ko.applyBindings(new grpViewModel(),$("#chartGrp")[0]);
    });
}

function editChart(chartid) {
    $("#chartModal").modal();
    var i = charts().findIndex(function(d) { return d['name'] == chartid });
    if (i != -1) {
        var chartData = charts()[i];
        $("#chartDim").val(chartData['dim']);
        $("#chartName").val(chartData['name']);
        $("#chartGrp").val(chartData['grp']);
        $("#chartType").val(chartData['chartType']);
        $("#chartWidth").val(chartData['width']);
        $("#chartHeight").val(chartData['height']);
    }
}

function removeChart(chartid) {
    $("#chart_"+chartid).remove();
    var i = charts().findIndex(function(d) { return d['name'] == chartid });
    if (i != -1) {
        charts.splice(i, 1);
    }
}

function buildChartObj() {
    var dimName = $("#chartDim").val();
    var chartType = $("#chartType").val();
    var chartData = {
        "name" : $("#chartName").val(),
        "dim" : dimName,
        "grp" : $("#chartGrp").val(),
        "chartType" : chartType,
        "width" :  $("#chartWidth").val(),
        "height" :  $("#chartHeight").val()
    }
    chartData['options'] = buildChartOptions(chartType);;
    return chartData;
}

export {
    charts,
    initChartBindings,
    addChart
}
