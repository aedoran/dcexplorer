import { editors, createEditor } from './editors.js';
import { addCrossDim, removeCrossDim } from './cross.js';

const dims = ko.observableArray();

function initDimBindings() {
    $(document).ready( function () {
        createEditor('dimEditor');
        $("#saveDimButton").click(saveDim);
        $("#dimTable").DataTable({
            "data" : dims,
            columns : [
                    { data : "name" },
                    { data : "editLink" },
                    { data : "removeLink" }
                ]
        });
    });
}

function updateDimTable() {
    var table = $("#dimTable").DataTable()
    table.clear().rows.add(dims()).draw();
    $(".dimEditButton").unbind("click")
                         .click(function() {
        dimLoad($(this).attr("did"));
    });
    $(".dimRemoveButton").unbind("click")
                         .click(function() {
        dimRemove($(this).attr("did"));
    });
}

function dimLoad(_d) {
    var dim = dims().filter(function(d) { return d.name == _d })[0];
    $("#dimName").val(dim['name']);
    editors['dimEditor'].setValue(dim['func']);
    $("#dimModal").modal();
}

var saveDim = function() {
    var name = $("#dimName").val();
    var func = editors['dimEditor'].getValue();
    var dim = {
        "name" : name,
        "func" : func,
        "editLink" : "<button did='"+name+"' class='dimEditButton' role='button'>Edit</button>",
        "removeLink" : "<button did='"+name+"' class='dimRemoveButton' role='button'>Remove</button>"
    }
    var i = dims().findIndex(function(d) { return d['name'] == name });
    if (i != -1) {
        dims.splice(i, 1);
    }
    dims.push(dim);
    updateDimTable();
    addCrossDim(name,func);
}

var dimRemove = function(_d) {
    var i = dims().findIndex(function(d) { return d['name'] == _d });
    if (i != -1) {
        dims.splice(i, 1);
    }
    updateDimTable();
    removeCrossDim(_d);
}

export {
    initDimBindings,
    dims,
    updateDimTable
}
