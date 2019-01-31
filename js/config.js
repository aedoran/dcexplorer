import { cleans, updateCleanTable, getCleanFilter, updateCleanFilter } from './cleans.js'
import { dims, updateDimTable } from './dims.js'
import { grps, updateGrpTable } from './groups.js'
import { charts, addChart } from './charts.js'
import { getStyle, updateStyle } from './style.js'
import { buildIndex, loadCrossDims } from './cross.js'
import { getQueryStringParam } from './util.js'


function initConfigBindings() {
    $("#downloadConfigButton").click(downloadConfig);
    $("#loadConfigButton").click(function() {
        var loc = $("#configLocation").val()+"?"+Math.random();
        loadConfig(loc);
    });
    var loc = $("#configLocation").val()+"?"+Math.random();
}

function downloadConfig() {
  var data = JSON.stringify(createConfig(),null,2);
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
  element.setAttribute('download', "config.json");
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function createConfig() {
    var data = {
        "cleans": cleans(),
        "dims" : dims(),
        "grps" : grps(),
        "charts": charts(),
        "style" : getStyle(),
        "filter" : getCleanFilter()
    }
    return data;
}

function parseConfig(c) {
    for (let l in c['cleans']) {
      cleans.push(c['cleans'][l]);
    }
    for (let d in c['dims']) {
      dims.push(c['dims'][d]);
    }
    for (let g in c['grps']) {
      grps.push(c['grps'][g]);
    }
    for (let l in c['charts']) {
      charts.push(c['charts'][l]);
    }
    updateGrpTable();
    updateCleanTable();
    updateDimTable();
    updateStyle(c['style']);
    updateCleanFilter(c['filter'])
}

function loadConfig(loc) {
    $.getJSON(loc+"?"+Math.random(),function(d) {
        parseConfig(d);
        buildIndex();
        loadCrossDims();
        charts().forEach(function(c) {
            addChart(c);
        });
    });
}

export {
    initConfigBindings,
    loadConfig,
    parseConfig
}
