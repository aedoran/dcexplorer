import { initRawBindings } from './loadRaw.js'
import { initConfigBindings } from './config.js'
import { initCleanBindings } from './cleans.js'
import { initDimBindings } from './dims.js'
import { initGroupBindings } from './groups.js'
import { initChartBindings } from './charts.js'
import { initStyleBindings } from './style.js'

function loadEditor() {
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
    console.debug("loadViz");
    initRawBindings();
}

export {
    loadEditor,
    loadViz
}

