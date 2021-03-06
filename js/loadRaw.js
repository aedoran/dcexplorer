import { loadMetaIntoCleanModal } from './cleans.js'
import { getQueryStringParam } from './util.js'
import { loadConfig } from './config.js'
import { getData } from './util.js'
let raw = []
const meta = []

function initRawBindings() {
    $(document).ready( function () {
        $("#loadSourceButton").click(function () {
            loadSource($("#sourceLocation").val())
        })
    });
}

function loadSource(f,callback) {
    $("#loadSourceButton").html("Loading...");

    getData(f,function(grains) {
      raw = grains;
      grains.columns.forEach(function(c) {
        var vals = grains.map(function(g) { return g[c]});
        var props = {
          "column" : c,
          "cardinality" : d3.set(vals).size(),
          "nulls" : vals.filter(function(g) {return !g}).length,
          "numberLike" : vals.filter(function(g) {return !!+g}).length,
          "dateLike" : vals.filter(function(g) { return !!+new Date(g)}).length
        };
        meta.push(props);
      });
        loadMetaIntoCleanModal(meta)
        $("#loadSourceButton").html("Load Source Data");

        if (callback) {
            callback()
        }
    });
}



export {
    raw,
    meta,
    initRawBindings,
    loadSource
}
