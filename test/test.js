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
    describe('tokenizer', function () {
        it('regexp', function () {
            var tokenizer = verboseRegExp.makeTokenizer()
            var toks = tokenizer.re;
            var n = tokenizer.indices;
            var str = 'f1(ftwo(3; "str"))';
            equal(toks.exec(str)[n.atom], 'f1')
            equal(toks.exec(str)[n.paren], '(')
            equal(toks.exec(str)[n.atom], 'ftwo')
            equal(toks.exec(str)[n.paren], '(')
            equal(toks.exec(str)[n.numb], '3')
            equal(toks.exec(str)[n.sep], ';')
            equal(toks.exec(str)[n.str], '"str"')
            equal(toks.exec(str)[n.cparen], ')')
            equal(toks.exec(str)[n.cparen], ')')
            equal(toks.exec(str), null);
        });
        it('advances tokens', function () {
            var tokenizer = verboseRegExp.makeTokenizer()
            tokenizer.feed('func 2 1');
            var func = tokenizer.advance();
            equal(func.type, 'atom');
            equal(func.text, 'func');
            tokenizer.advance();  // 2
            equal(tokenizer.advance().text, '1');
            try {
                tokenizer.advance();
                ok(false);
            } catch (e) {
                ok(true, 'raised ' + e + 'when finished with tokens');
            }
        });
        it('peeks', function () {
            var tokenizer = verboseRegExp.makeTokenizer();
            tokenizer.feed('someatom 1 2 3');
            tokenizer.advance();
            equal(tokenizer.peek().text, '1');
            equal(tokenizer.peek().text, '1');
            tokenizer.advance();
            equal(tokenizer.peek().text, '2');
            equal(tokenizer.advance().text, '1');
            equal(tokenizer.peek().text, '2');
            tokenizer.advance(), tokenizer.advance();
            equal(tokenizer.peek(), null);
        });
        it('looks back', function () {
            var tokenizer = verboseRegExp.makeTokenizer();
            tokenizer.feed('1 2 3');
            tokenizer.advance();
            equal(tokenizer.lookBack(), '1');
            equal(tokenizer.lookBack(), '1');
            equal(tokenizer.lookBack(2), null);
        });
    });
});
