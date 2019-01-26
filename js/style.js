import { editors, createEditor } from './editors.js';

const obj = {'styleString' : ''}


function initStyleBindings() {
    $(document).ready( function () {
        createEditor('styleEditor','ace/mode/css');
        $("#saveStyle").click(function() { 
            $("#customStyle").html(editors['styleEditor'].getValue())
            setStyle(editors['styleEditor'].getValue());
        });
        editors['styleEditor'].setValue(getStyle());
    });
}

function updateStyle(s) {

    obj['styleString'] = s;
    if (editors['styleEditor']) {
        editors['styleEditor'].setValue(s);
    }
    $("#customStyle").html(s);
}

function setStyle(s) {
    obj['styleString'] = s;

}

function getStyle() {
    return obj['styleString'];
}

export {
    initStyleBindings,
    updateStyle,
    getStyle
}
