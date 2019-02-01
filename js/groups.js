import { editors, createEditor } from './editors.js';

const grps = ko.observableArray();

function initGroupBindings() {
    $(document).ready( function () {
        createEditor('grpEditor');
        createEditor('grpExtraEditor');
        $("#saveGroupButton").click(saveGrp);
        $("#grpTable").DataTable({
            "data" : grps,
            columns : [
                    { data : "name" },
                    { data : "editLink" },
                    { data : "removeLink" }
                ]
        });
    });

}

function  updateGrpTable() {
    var table = $("#grpTable").DataTable()
    table.clear().rows.add(grps()).draw();
    $(".groupEditButton").unbind("click")
                         .click(function() {
        grpLoad($(this).attr("gid"));
    });
    $(".groupRemoveButton").unbind("click")
                         .click(function() {
        grpRemove($(this).attr("gid"));
    });
}

function grpLoad(_d) {
    var grp = grps().filter(function(d) { return d.name == _d })[0];
    $("#grpName").val(grp['name']);
    $("#grpExtraName").val(grp['extraName']);
    editors['grpEditor'].setValue(grp['func']);
    editors['grpExtraEditor'].setValue(grp['extraFunc'] || "");
    $("#grpFuncs").val(grp['aggs']);
    $("#grpExtraFuncs").val(grp['extraAggs']);
    $("#grpModal").modal();
}

function saveGrp() {
    var name = $("#grpName").val()

    var grp = {
        "name" : name,
        "extraName" : $("#grpExtraName").val(),
        "func" : editors['grpEditor'].getValue(),
        "extraFunc" : editors['grpExtraEditor'].getValue(),
        "aggs" : $("#grpFuncs").val(),
        "extraAggs" : $("#grpExtraFuncs").val(),
        "editLink" : "<button gid='"+name+"' class='groupEditButton' role='button'>Edit</button>",
        "removeLink" : "<button gid='"+name+"' class='groupRemoveButton' role='button'>Remove</button>"
    }
    var i = grps().findIndex(function(d) { return d['name'] == name });
    if (i != -1) {
        grps.splice(i, 1);
    }
    grps.push(grp);
    updateGrpTable();
}

function grpRemove(_d) {
    var i = grps().findIndex(function(d) { return d['name'] == _d });
    if (i != -1) {
        grps.splice(i, 1);
    }
    updateGrpTable();
}
function grpMaker(dim,grpObj) {
    var _g = dim.group();
    var reducer = reductio();
    grpObj['aggs'].forEach(function(a) {

        if (a=="count") {
            reducer[a](true);
        } else {
            var get_func = "(function a() { return "+grpObj['func']+ " })()";
            reducer[a](eval(get_func));
        }
    });

    if  (grpObj['extraName']) {
      var xtra = reducer.value(grpObj['extraName']);
      grpObj['extraAggs'].forEach(function(a) {

          if (a=="count") {
              xtra[a](true);
          } else {
              var get_func = "(function a() { return "+grpObj['extraFunc']+ " })()";
              xtra[a](eval(get_func));
          }
      });
    }

    return reducer(_g);
}

export {
    initGroupBindings,
    grps,
    updateGrpTable,
    grpMaker
}
