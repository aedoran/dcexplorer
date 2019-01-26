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

function initEditor(id) {
    return function() {
        createEditor(id);
    }
}

function generateChartOptions() {
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
    }]
}

export {
    generateChartOptions,
    buildChartOptions
}
