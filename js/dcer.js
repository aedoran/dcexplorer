import { initRawBindings, loadSource} from './loadRaw.js'
import { initConfigBindings, parseConfig } from './config.js'
import { initCleanBindings, setCleanedData } from './cleans.js'
import { initDimBindings } from './dims.js'
import { initGroupBindings } from './groups.js'
import { initChartBindings, charts, addChart } from './charts.js'
import { initStyleBindings } from './style.js'
import { getQueryStringParam, getData } from './util.js'
import { buildIndex, loadCrossDims } from './cross.js'

function loadEditorOld() {
    console.debug("loadEditor");
    initRawBindings();
    initConfigBindings();
    initCleanBindings();
    initDimBindings();
    initGroupBindings();
    initChartBindings();
    initStyleBindings();
}

function loadViz() {
  var source = getQueryStringParam("source");
  var config = getQueryStringParam("config");
  var cleaned = getQueryStringParam("cleaned");

  if (cleaned) {
      getData(cleaned,function(cleanData) {
          setCleanedData(cleanData);
          if (config) {
              getData(config,function(configData) {
                  parseConfig(configData);
                  buildIndex();
                  loadCrossDims();
                  charts().forEach(function(c) {
                    addChart(c);
                  })
              })
          }
      })
  } else if (source) {
      loadSource(source,function() {
          if (config) {
              getData(config,function(configData) {
                  parseConfig(configData);
                  buildIndex();
                  loadCrossDims();
                  charts().forEach(function(c) {
                    addChart(c);
                  })
              })
          }
      })
  }
}

function loadEditor() {
  var source = getQueryStringParam("source");
  var config = getQueryStringParam("config");
  var cleaned = getQueryStringParam("cleaned");

  if (cleaned) {
      getData(cleaned,function(cleanData) {
          setCleanedData(cleanData);
          if (config) {
              getData(config,function(configData) {
                  parseConfig(configData);
                  buildIndex();
                  loadCrossDims();
                  charts().forEach(function(c) {
                    addChart(c);
                  })
              })
          }
      })
  } else if (source) {
      loadSource(source,function() {
          if (config) {
              getData(config,function(configData) {
                  parseConfig(configData);
                  buildIndex();
                  loadCrossDims();
                  charts().forEach(function(c) {
                    addChart(c);
                  })
              })
          }
      })
  }
  initRawBindings();
  initConfigBindings();
  initCleanBindings();
  initDimBindings();
  initGroupBindings();
  initChartBindings();
  initStyleBindings();
}

export {
    loadEditor,
    loadViz
}
