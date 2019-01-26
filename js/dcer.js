import { initRawBindings } from './loadRaw.js'
import { initConfigBindings } from './config.js'
import { initCleanBindings } from './cleans.js'
import { initDimBindings } from './dims.js'
import { initGroupBindings } from './groups.js'
import { initChartBindings } from './charts.js'

function loadEditor() {
    console.debug("loadEditor");
    initRawBindings();
    initConfigBindings();
    initCleanBindings();
    initDimBindings();
    initGroupBindings();
    initChartBindings();
}

function loadViz() {
    console.debug("loadViz");
    initRawBindings();
}

export {
    loadEditor,
    loadViz
}

