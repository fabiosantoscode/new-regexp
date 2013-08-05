(function (exportFunc) {
    function verboseRegExp (exp) {
        return ;
    }

    verboseRegExp.makeTokenizer = function () {
        var tokens = [
            ['(\\w+)', 'atom'],
            ['(\'\\w+\'|"\\w+")', 'str'],
            ['(\\()', 'paren'],
            ['(\\))', 'cparen'],
            ['(;)', 'sep']
        ];
        var reStr = '',
            tokenNames = [],
            tokenIndices = {};
        for (var i = 0; i < tokens.length; i++) {
            reStr += tokens[i][0] + (i === tokens.length -1 ? '' : '|');
            tokenNames[i + 1] = tokens[i][1];
            tokenIndices[tokens[i][1]] = i + 1;
        }
        parser = new RegExp(reStr, 'g');
        return {
            re: parser,
            names: tokenNames,
            indices: tokenIndices
        };
    };

    exportFunc('verboseRegExp', verboseRegExp);
}(function () {
    if (typeof window === 'object') {
        return function (name, object) {
            window[object] = name;
        };
    } else if (typeof require === 'function') {
        return function (name, object) {
            module.exports = object;
        };
    } else {
        throw 'Unknown environment!';
    }
}()));
