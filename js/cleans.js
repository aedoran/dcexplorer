import { editors, createEditor } from './editors.js';
import { raw } from './loadRaw.js';

const cleans = ko.observableArray();

function initCleanBindings() {
    $(document).ready( function () {
        createEditor('cleanEditor');
        $("#saveCleanButton").click(saveClean);
        $("#downloadCleanedButton").click(downloadCleaned);
        $("#cleanTable").DataTable({
            "data" : cleans,
            columns : [
                    { data : "name" },
                    { data : "editLink" },
                    { data : "removeLink" }
                ]
        });
    });
}


function loadMetaIntoCleanModal(meta) {
    $('#columnCleanerTable').DataTable({
        data: meta,
        columns : [
            { data : "column" },
            { data : "cardinality" },
            { data : "nulls" },
            { data : "numberLike" },
            { data : "dateLike" }
        ]
    });
}

function updateCleanTable() {
    var table = $("#cleanTable").DataTable()
    table.clear().rows.add(cleans()).draw();
    $(".cleanEditButton").unbind("click")
                         .click(function() {
        cleanLoad($(this).attr("cid"));
    });
    $(".cleanRemoveButton").unbind("click")
                         .click(function() {
        cleanRemove($(this).attr("cid"));
    });
}

function downloadCleaned() {
  var blob = new Blob([JSON.stringify(createCleanedData())], {type : "application/json"});
      $("<a />", {
        "download": "cleaned.json",
        "href" : window.URL.createObjectURL(blob)
      }).appendTo("body")
      .click(function() {
         $(this).remove()
      })[0].click()
}

function cleanLoad(_d) {
    var clean = cleans().filter(function(d) { return d.name == _d })[0];
    $("#cleanName").val(clean['name']);
    editors['cleanEditor'].setValue(clean['func']);
    $("#cleanModal").modal();
}

function saveClean() {
    var name = $("#cleanName").val()
    var clean = {
        "name" : name,
        "func" : editors['cleanEditor'].getValue(),
        "editLink" : "<button cid='"+name+"' class='cleanEditButton' role='button'>Edit</button>",
        "removeLink" : "<button cid='"+name+"' class='cleanRemoveButton' role='button'>Remove</button>"
    }
    var i = cleans().findIndex(function(d) { return d['name'] == name });
    if (i != -1) {
        cleans.splice(i, 1);
    }
    cleans.push(clean);
    updateCleanTable();
    //buildIndex();
}

function cleanRemove(_d) {
    var i = cleans().findIndex(function(d) { return d['name'] == _d });
    if (i != -1) {
        cleans.splice(i, 1);
    }
    updateCleanTable();
}
function createCleanedData() {
    var cleanFunctions = {}
    var cleanedData = [];


    cleans().forEach(function(c) {
        var get_func = "(function a() { return "+c['func']+ " })()";
        cleanFunctions[c['name']] = eval(get_func);
    })


    raw.forEach(function(r) {
        var cleaned = {}
        cleans().forEach(function(c) {
            cleaned[c['name']] = cleanFunctions[c['name']](r);
        });
        cleanedData.push(cleaned);
    }); 
    return cleanedData;
}

export {
    cleans,
    saveClean,
    loadMetaIntoCleanModal,
    initCleanBindings,
    updateCleanTable,
    createCleanedData
}
