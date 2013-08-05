var verboseRegExp = require('../regexp.js');
var ok = require('assert');

function equal(a, b, msg) {
    if (!msg) {
        function x(v){
            return v + ' (type ' + typeof v + ')'
        }
        msg = [x(a), 'should equal', x(b)].join(' ')
    }
    ok.equal(a, b, msg)
}

describe('parser', function () {
    it('Its tokenizer regexp', function () {
        var tokenizer = verboseRegExp.makeTokenizer()
        var toks = tokenizer.re;
        var n = tokenizer.indices;
        var str = 'f1(ftwo(3; "str"))';
        equal(toks.exec(str)[n.atom], 'f1')
        equal(toks.exec(str)[n.paren], '(')
        equal(toks.exec(str)[n.atom], 'ftwo')
        equal(toks.exec(str)[n.paren], '(')
        equal(toks.exec(str)[n.atom], '3')
        equal(toks.exec(str)[n.sep], ';')
        equal(toks.exec(str)[n.str], '"str"')
        equal(toks.exec(str)[n.cparen], ')')
        equal(toks.exec(str)[n.cparen], ')')
        equal(toks.exec(str), null);
    });
});
