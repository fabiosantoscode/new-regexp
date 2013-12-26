(function (exportFunc) {
    function verboseRegExp (exp) {
        return ;
    }

    verboseRegExp.makeTokenizer = function (forStr) {
        var tokens = [
            ['(\\d+)', 'numb'],
            ['(\\w+)', 'atom'],
            ['(;)', 'sep'],
            ['(\'\\w+\'|"\\w+")', 'str'],
            ['(\\()', 'paren'],
            ['(\\))', 'cparen']
        ];
        var reStr = '',
            tokenNames = [],
            tokenIndices = {};
        for (var i = 0; i < tokens.length; i++) {
            reStr += tokens[i][0] + (i === tokens.length -1 ? '' : '|');
            tokenNames[i + 1] = tokens[i][1];
            tokenIndices[tokens[i][1]] = i + 1;
        }
        function Token(type, text) {
            this.type = type;
            this.text = text;
        }
        Token.fromGroups = function (groups) {
            var currentType,
                currentText;
            for (var t = 1; t < groups.length; t += 1) {
                if (groups[t]) {
                    currentType = tokenNames[t];
                    currentText = groups[t];
                    break;
                }
            }
            return new Token(currentType, currentText);
        };
        var tokenizer = {
            re: null,
            names: tokenNames,
            indices: tokenIndices,
            fed: null,
            queue: [],
            history: [],
            feed: function (fed) {
                this.re = new RegExp(reStr, 'g');
                this.fed = fed;
            },
            peek: function () {
                if (this.queue.length) return this.queue[0];
                var next = Token.fromGroups(
                    this.re.exec(this.fed))
                this.queue.unshift(next);
                return next;
            },
            advance: function () {
                var groups,
                    tok;
                if (this.queue.length) {
                    tok = this.queue.splice(1)[0];
                } else {
                    groups = this.re.exec(this.fed);
                    tok = Token.fromGroups(groups);
                }
                this.history.push(tok);
                return tok;
            }
        };
        tokenizer.feed(forStr || null);
        return tokenizer;
    };

    verboseRegExp.parse = function (str) {
        var tokenizer = verboseRegExp.makeTokenizer();
        var names = tokenizer.names;
        var re = tokenizer.re;
        var i = tokenizer.indices;
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
