import { createEditor, editors } from './editors.js';

function inputTextTmpl(c) {
    return `
            <div class='form-group'>
                <label for='${c.id}'>${c.instructions}</label>
                <input class='${c.optionType} form-control' id='${c.id}' dcfunc='${c.dcfunc}' ariadescribedby='${c.id}Help' placeholder='${c.placeholder}'>
                <small id='${c.id}Help' class='form-text -muted'>${c.help}</small>
            </div>`
}

function editorInputTmpl(c) {
    return `
            <div class='form-group'>
                <label for='${c.id}'>${c.instructions}</label>
                <div id='${c.id}' dcfunc='${c.dcfunc}' class='${c.optionType} modal-editor'>${c.placeholder}</div>
                <small id='${c.id}Help' class='form-text text-muted'>${c.help}</small>
            </div>`
}
function selectInputTmpl(c) {
    return `
            <div class='form-group'>
                <label for='${c.id}'>${c.instructions}</label>
                <select id='${c.id}' dcfunc='${c.dcfunc}' class='${c.optionType}'>
                </select>
                <small id='${c.id}Help' class='form-text text-muted'>${c.help}</small>
            </div>`
}

function initEditor(id) {
    return function() {
        createEditor(id);
    }
}

function initSelect(id,options) {
    return function() {
        options.forEach(function(o) {
            $(`#${id}`).append(`<option value='${o}'>${o}</option>`);
        });
    }
}

function generateChartOptions(chartData) {
  var chartType = $("#chartType").val()
  var html = "";
  chartOptions[chartType].forEach(function(o) {
        html += o.tmpl(o);
  });
  $("#chartOptions").html(html);

  chartOptions[chartType].forEach(function(o) {
        if (o['init']) {
            o['init']();
        }
  });
  if (chartData) {
      $(`#chartOptions .${chartType}Option`).each(function() {
            var dcfunc = $(this).attr('dcfunc');
            var id = $(this).attr('id');
            var el = $(this);
            setHTMLOption(id,dcfunc,el,chartData);
      });
  }
}

function setHTMLOption(id,dcfunc,el,chartData) {
    var setFunc;
    if (el.hasClass("ace_editor")) {
        setFunc = function(v) { editors[id].setValue(v) };
    } else {
        setFunc = function(v) { el.val(v) };
    }

    if (id.indexOf("XAxis") != -1) {
        setFunc(chartData.options['xAxis'][dcfunc]);
    }
    else if (id.indexOf("YAxis") != -1) {
        setFunc(chartData.options['yAxis'][dcfunc]);
    } else {
        setFunc(chartData.options[dcfunc]);
    }
}

function buildChartOptions(chartType) {
  var chartOptions = {};
  $("."+chartType+"Option").each(function(o) {  
    var id = $(this).attr('id');
    var dfunc = $(this).attr('dcfunc');
    if ($(this).attr("class").indexOf("ace_editor") != -1) {
        //chartOptions[dfunc] = editors[id].getValue();
        setOption(chartOptions,id,dfunc,editors[id].getValue()) 
    } else{
        setOption(chartOptions,id,dfunc,$(this).val())
    }
  });

  return chartOptions;
}

function setOption(chartOptions,id,dfunc,value) {
    if (id.indexOf("XAxis") != -1) {
        if (Object.keys(chartOptions).indexOf('xAxis') == -1) {
            chartOptions['xAxis'] = {};
        }
        chartOptions['xAxis'][dfunc] = value;
    } else if (id.indexOf("YAxis") != -1) {
        if (Object.keys(chartOptions).indexOf('yAxis') == -1) {
            chartOptions['yAxis'] = {};
        }
        chartOptions['yAxis'][dfunc] = value;
    } else {
        chartOptions[dfunc] = value;
    }
    return chartOptions;
}



const chartOptions = {
    "geoChoroplethChart" : [{
        optionType : "geoChoroplethChartOption",
        id : "geoChoroplethChartOptionValueAccessor",
        dcfunc : "valueAccessor",
        placeholder : "function (d) { return d.value.count }",
        instructions : "add a function based on the group",
        help : "",
        tmpl : editorInputTmpl,
        init : initEditor('geoChoroplethChartOptionValueAccessor')
    },{
        optionType : "geoChoroplethChartOption",
        id : "geoChoroplethChartOptionColors",
        dcfunc : "colors",
        placeholder : `d3.scaleQuantize().range(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"])`,
        instructions: "Color output function",
        help: '',
        tmpl : editorInputTmpl,
        init : initEditor('geoChoroplethChartOptionColors')
    },{
        optionType : "geoChoroplethChartOption",
        id : "geoChoroplethChartOptionColorDomain",
        dcfunc : "colorDomain",
        placeholder : `[0, 200]`,
        instructions: "Color input rangee",
        help: 'This should have the max and min of the input values',
        tmpl : editorInputTmpl,
        init : initEditor('geoChoroplethChartOptionColorDomain')
    },{
        optionType : "geoChoroplethChartOption",
        id : "geoChoroplethChartOptionColorCalculator",
        dcfunc : "colorCalculator",
        placeholder : `function (d) { return d ? this.colors()(d) : '#ccc'; }`,
        instructions: "Color input calculator",
        help: 'handy to handle when values are messing what colors should it default to',
        tmpl : editorInputTmpl,
        init : initEditor('geoChoroplethChartOptionColorCalculator')
    },{
        optionType : "geoChoroplethChartOption",
        id : "geoChoroplethChartOptionOverlayGEO",
        dcfunc : "GEO",
        placeholder : `[0, 200]`,
        instructions: 'Choose a map',
        help: 'This chooses which map to use',
        tmpl : selectInputTmpl,
        init : initSelect('geoChoroplethChartOptionOverlayGEO',['usstates','uscounties'])
    }],
    "numberDisplay" : [{
        optionType : "numberDisplayOption",
        id : "numberDisplayOptionValueAccessor",
        dcfunc : "valueAccessor",
        placeholder : "function (d) { return d.value.count }",
        instructions : "add a function based on the group",
        help : "just use the example and change the endpoints",
        tmpl : editorInputTmpl,
        init : initEditor('numberDisplayOptionValueAccessor')
    },{
        optionType : "numberDisplayOption",
        id : "numberDisplayOptionHtml",
        dcfunc : "html",
        placeholder : '{\n one:"<span style=\"color:steelblue; font-size: 26px;\">%number</span> Monkey",\n some:"<span style=\"color:steelblue; font-size: 26px;\">%number</span> Total Monkeys",\n none:"<span style=\"color:steelblue; font-size: 26px;\">No</span> Monkeys"\n }',
        instructions : "Template for the number",
        help : "just use the example and change the endpoints",
        tmpl : editorInputTmpl,
        init : initEditor('numberDisplayOptionHtml')
    }],
    "pieChart" : [{
        optionType : "pieChartOption",
        id : "pieChartOptionValueAccessor",
        dcfunc : "valueAccessor",
        placeholder : "function (d) { return d.value.count }",
        instructions : "add a function based on the group",
        help : "just use the example and change the endpoints",
        tmpl : editorInputTmpl,
        init : initEditor('pieChartOptionValueAccessor')
    }],
    "rowChart" : [{
        optionType : "rowChartOption",
        id : "rowChartOptionValueAccessor",
        dcfunc : "valueAccessor",
        placeholder : "function (d) { return d.value.count }",
        instructions : "add a function based on the group",
        help : "just use the example and change the endpoints",
        tmpl : editorInputTmpl,
        init : initEditor('rowChartOptionValueAccessor')
    },{
        optionType : "rowChartOption",
        id : "rowChartOptionXAxisTickFormat",
        dcfunc : "tickFormat",
        placeholder : "d3.format('.2s')",
        instructions : "Function to format the axis values",
        help : "use this: https://github.com/d3/d3-format to understand how to do more",
        tmpl : editorInputTmpl,
        init : initEditor('rowChartOptionXAxisTickFormat')
    },{
        optionType : "rowChartOption",
        id : "rowChartOptionElasticX",
        dcfunc : "elasticX",
        placeHolder : "1",
        help : "use \"1\"  or \"0\"",
        instructions : "Whether the x scale gets normalized after each filter",
        tmpl : inputTextTmpl
    }],
    "barChart" : [{ 
        optionType : "barChartOption",
        id : "barChartOptionX",
        dcfunc : "x",
        placeholder : "d3.scaleLinear().domain([6,20])",
        instructions : "add a function a function for x",
        help : "just use the example and change the endpoints",
        tmpl : editorInputTmpl,
        init : initEditor('barChartOptionX')
    },{
        optionType : "barChartOption",
        id : "barChartOptionValueAccessor",
        dcfunc : "valueAccessor",
        placeholder : "function (d) { return d.value.count }",
        instructions : "add a function based on the group",
        help : "just use the example and change the endpoints",
        tmpl : editorInputTmpl,
        init : initEditor('barChartOptionValueAccessor')
    },{
        optionType : "barChartOption",
        id : "barChartOptionXAxisTickFormat",
        dcfunc : "tickFormat",
        placeholder : "d3.format('.2s')",
        instructions : "Function to format the axis X values",
        help : "use this: https://github.com/d3/d3-format to understand how to do more",
        tmpl : editorInputTmpl,
        init : initEditor('barChartOptionXAxisTickFormat')
    },{
        optionType : "barChartOption",
        id : "barChartOptionYAxisTickFormat",
        dcfunc : "tickFormat",
        placeholder : "d3.format('.2s')",
        instructions : "Function to format the axis Y values",
        help : "use this: https://github.com/d3/d3-format to understand how to do more",
        tmpl : editorInputTmpl,
        init : initEditor('barChartOptionYAxisTickFormat')
    }],
    "selectMenu" : [{
        optionType : "selectMenuOption",
        id : "selectMenuOptionControlsUseVisibility",
        dcfunc : "controlsUseVisibility",
        placeHolder : "1",
        help : "use \"1\"  or \"0\"",
        instructions : "Whether the x scale gets normalized after each filter",
        tmpl : inputTextTmpl
    },{
        optionType : "selectMenuOption",
        id : "selectMenuOptionMultiple",
        dcfunc : "multiple",
        placeHolder : "true",
        help : "use \"true\"  or \"false\"",
        instructions : "show multiple or not",
        tmpl : inputTextTmpl
    }]
}

export {
    generateChartOptions,
    buildChartOptions
}
