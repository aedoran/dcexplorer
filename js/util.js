function getQueryStringParam(value) {
    var p = location.search.replace(/^./,'')
        .split('&')
        .filter(function(s) { return s.split('=')[0] == value })
        .map(function(s) { return s.split('=')[1] })
    return p.length ? p[0] : null
}

function getData(loc,callback) {
    var splits = loc.split('.');
    var fileType = splits[splits.length-1].toLowerCase();

    d3[fileType](loc+"?"+Math.random()).then(callback);
}

export {
    getQueryStringParam,
    getData
}
