import { dims } from './dims.js';
import { createCleanedData } from './cleans.js';

const crossDims = [];
let indx;

function removeCrossDim(name) {
    crossDims[name].dispose();
    delete crossDims[name];
}

function addCrossDim(name,func) {
    if (Object.keys(crossDims).indexOf(name) != -1) {
        removeCrossDim(name);
    }
    
    var get_func = "(function a() { return "+func+ " })()";
    var dim = indx.dimension(eval(get_func));
    crossDims[name] = dim;
}

function loadCrossDims() {
    dims().forEach(function(d) {
        addCrossDim(d['name'],d['func']);
    });
}

function buildIndex() {
    indx = crossfilter(createCleanedData());
}

export {
    addCrossDim,
    removeCrossDim,
    buildIndex,
    loadCrossDims,
    crossDims
}
