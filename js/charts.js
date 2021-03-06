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
  var ci = charts().findIndex(function(d) { return d['name'] == chartData['name'] });


  var html = chartTemplate(chartData)
  //$("#graphContainer").append(html);

  if (ci == -1) {
    //$("#graphContainer").append(html);
    charts.push(chartData);
  } else {
    //$("#chart_"+chartData['name']).replaceWith(html);
    charts()[ci] = chartData;
  }

  if ($("#chart_"+chartData['name']).length) {
    $("#chart_"+chartData['name']).replaceWith(html);
  } else {
    $("#graphContainer").append(html);
  }

  if (chartData['chartType'] == 'geoChoroplethChart') {
    var maptype = chartData.options['GEO'];
    d3.json(mapmap[maptype].loc).then(function(map) {
      doStuff(map);
    });
  } else if (chartData['chartType'] != 'html') {
    doStuff();
  } else {
      var selector = "#chart_"+chartData['name']+" .card-body";
      $(selector).html(chartData.options['html'])
      $(".chartEditButton").click(function() { editChart($(this).attr('cid')) });
      $(".chartRemoveButton").click(function() { removeChart($(this).attr('cid')) });
  }

  function doStuff(preload) {

      var gi = grps().findIndex(function(d) { return d['name'] == chartData['grp'] });
      var grpObj = grps()[gi];
      var dim = crossDims[chartData['dim']];
      var grp = grpMaker(dim,grpObj);



      if (chartData['heading']) {
        $(`#chart_${chartData['name']} .heading`).html(chartData['heading']);
      }

      var selector = "#chart_"+chartData['name']+" .card-body";
      console.log(selector);
      var chart = dc[chartData['chartType']](selector);
      console.log(chart);
      console.log(chartData);

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
            chart.projection(d3.geoAlbersUsa().fitSize([$(selector).width(),chartData['height']],preload));
            //chart.legend(dc.legend().x(40).y(40).itemHeight(13).gap(5).legendText(function() { return "Hi" }));
            //chart.legend(dc.legend().legendText(function(d, i) { return "Hi" }));
            chart.legendables = function () {
              return chart.group().all().map(function (d, i) {
                  var legendable = {name: d.key, data: d.value, others: d.others, chart: chart};
                  legendable.color = chart.colorCalculator()(d.value);
                return legendable;
              });
            };
            chart.legend(dc.legend().x(400).y(10).itemHeight(13).gap(5));
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
      if (chartData['chartType'] == 'geoChoroplethChart') {
        chart.legendables = function () {
          console.log(chart.colorDomain());
          var t = chart.colors().thresholds();
          console.log(t);
          console.log(t.map(function(d) { return chart.colorCalculator()(d) }));
          return t.map(function(d) {
            return {name: d3.format('+1.0%')(d), chart:chart, color:chart.colorCalculator()(d)}
          }).reverse();
          /*
          return [
            {name: "-10%", data: "asdf", chart:chart, color :"#f00"},
            {name: "+10%", data: "asdf", chart:chart, color :"#0f0"},
          ]*/
          /*
          return chart.group().all().map(function (d, i) {
              var legendable = {name: d.key, data: d.value, others: d.others, chart: chart};
              legendable.color = chart.colorCalculator()(d.value);
            return legendable;
          });*/
        };
        chart.legend(dc.legend().x(10).y(10).itemHeight(13).autoItemWidth(true).gap(1).horizontal(false));
      }
      chart.render();
      $(".chartEditButton").click(function() { editChart($(this).attr('cid')) });
      $(".chartRemoveButton").click(function() { removeChart($(this).attr('cid')) });
      dc.renderAll();
    }
}

function chartTemplate(c) {
    return `
            <div class='ml-0 p-0 mb-1 mr-1' id='chart_${c.name}' style="width:${c.width*100}px">
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
        $("#moveChartUpButton").click(function() {
            moveUp($("#chartName").val());
        });
        $("#moveChartDownButton").click(function() {
            moveDown($("#chartName").val());
        });
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

function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};

function moveUp(id) {
    var elid = `#chart_${id}`;
    var el = $(elid);
    var prev = el.prev();
    el.insertBefore(prev);

    var ci = charts().findIndex(function(d) { return d['name'] == id });
    array_move(charts(),ci,ci-1);
}

function moveDown(id) {
    var elid = `#chart_${id}`;
    var el = $(elid);
    var after = el.next();
    el.insertAfter(after);

    var ci = charts().findIndex(function(d) { return d['name'] == id });
    array_move(charts(),ci,ci+1);
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
