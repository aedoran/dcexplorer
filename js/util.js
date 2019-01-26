function getQueryStringParam(value) {
        var p = location.search.replace(/^./,'')
                .split('&')
                .filter(function(s) { return s.split('=')[0] == value })
                .map(function(s) { return s.split('=')[1] })
        return p.length ? p[0] : null
}

export {
    getQueryStringParam
}
