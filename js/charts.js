import { generateChartOptions, buildChartOptions } from './chartOptions.js'
import { grps, grpMaker } from './groups.js'
import { dims } from './dims.js'
import { crossDims } from './cross.js'

const charts = ko.observableArray();

const currentpath = window.location.origin +
                    location.pathname.split('/').splice(0,location.pathname.split('/').length-1).join("/");

const mapmap = {
    'usstates' : {
        "loc" : currentpath + '/data/us-states.json',
        "id" : "state",
        "lookup" : function(d) { return d.properties.name },
        "arr" : function(f) { return f.features }
    },
    'uscounties' : {
        "loc" : currentpath + '/data/us-counties.json',
        "id" : "id",
        "lookup" : function(d) { return d.id.toString() },
        "arr" : function(f) { return f.features }
    }
}

function downloadThing(json,filename) {
  var blob = new Blob([JSON.stringify(json)], {type : "application/json"});
      $("<a />", {
        "download": filename,
        "href" : window.URL.createObjectURL(blob)
      }).appendTo("body")
      .click(function() {
         $(this).remove()
      })[0].click()
}


function addChart(chartData) {
  if (chartData['chartType'] == 'geoChoroplethChart') {
    var maptype = chartData.options['GEO'];
    d3.json(mapmap[maptype].loc).then(function(map) {
        if (maptype == 'uscounties') {
            //var test = topojson.transform({"scale": [.5,.5]})
            //console.log(map);
            //var test2 = topojson.feature(map,map.objects.counties);
            //downloadThing(test2,'us-counties.json')
            console.log(map);
            doStuff(map);
        } else {
            doStuff(map);
        }
    });
  } else {
    doStuff();
  }
  function doStuff(preload) {
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


      if (chartData['heading']) {
        $(`#chart_${chartData['name']} .heading`).html(chartData['heading']);
      }

      var selector = "#chart_"+chartData['name']+" .card-body";
      var chart = dc[chartData['chartType']](selector);


      if (chartData['chartType'] != 'numberDisplay') {
        chart.dimension(dim);
      }

      if (chartData['chartType'] != 'selectMenu') {
        chart.group(grp);
      } else {
        chart.group(dim.group());
      }

        if (chartData['chartType'] == 'geoChoroplethChart') {
            var maptype = chartData.options['GEO'];
            chart.overlayGeoJson(mapmap[maptype].arr(preload),mapmap[maptype].id, mapmap[maptype].lookup);
            chart.projection(d3.geoAlbersUsa().fitSize([$(selector).width(),chartData['height']],preload))
        }

        chart.width($(selector).width())
         .height(parseInt(chartData['height']));

      if (chartData['options']) {
          Object.keys(chartData['options'])
            .filter(function(o) { return o != 'GEO' })
            .forEach(function(o) {
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
}

function chartTemplate(c) {
    return `
            <div class='col-${c.width} ml-0 p-0 mb-1 mr-1' id='chart_${c.name}'>
                <div class='card'>
                    <div class="bid-clipboard">
                        <div class='btn-group btn-clipboard' role='group'>
                            <button type='button' class='btn chartEditButton' cid='${c.name}'>edit</button>
                            <button type='button' class='btn chartRemoveButton' cid='${c.name}'>remove</button>
                        </div>
                    </div>
                    <div class="card-body">
                        <span class="heading"></span>
                    </div>
                </div>
            </div>`
}

function initChartBindings() {
    $(document).ready( function () {
        $("#addChartButton").click(function() {
            addChart(buildChartObj())
        });
        generateChartOptions();
        $("#chartType").on('change',function() {generateChartOptions()});
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
        $("#chartHeading").val(chartData['heading']);
        generateChartOptions(chartData);
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
        "height" :  $("#chartHeight").val(),
        "heading" : $("#chartHeading").val()
    }
    chartData['options'] = buildChartOptions(chartType);
    return chartData;
}

export {
    charts,
    initChartBindings,
    addChart
}
