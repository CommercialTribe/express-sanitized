const assert = require("assert");
const expressSanitized = require('../lib/express-sanitized');

function next(){}

describe('expressSanitized', function() {

    it('should sanitize empty', function() {
        testSanitizer('', '',  next);
    });

    it('should sanitize simple text', function() {
        testSanitizer('hello world', 'hello world', next);
    });

    it('should sanitize entities', function() {
        testSanitizer('&lt;hello world&gt;&', '&lt;hello world&gt;&', next);
    });

    it('should sanitize more entities', function() {
        testSanitizer('&amp&amp;&&amp', '&amp&&&amp', next);
    });

    it('should remove unknown tags', function() {
        testSanitizer('<u:y><b>hello <bogus><i>world</i></bogus></b>', '<b>hello <i>world</i></b>', next);
    });

    it('should remove unsafe tags', function() {
        testSanitizer('<b>hello <i>world</i><script src=foo.js></script></b>', '<b>hello <i>world</i></b>', next);
    });

    it('should remove unsafe attributes', function() {
        testSanitizer('<b>hello <i onclick="takeOverWorld(this)">world</i></b>', '<b>hello <i>world</i></b>', next);
    });

    it('should escape cruft', function() {
        testSanitizer('<b>hello <i>world<</i></b> & tomorrow the universe', '<b>hello <i>world&lt;</i></b> & tomorrow the universe', next);
    });
});

function testSanitizer(value, expectedValue, next) {
    const req = {
        body: {
            data: value
        },
        query: {
            variables: {
                field: value
            }
        }
    };
    expressSanitized()(req, '', next);
    assert.equal(req.query.variables.field, expectedValue);
    assert.equal(req.body.data, expectedValue);
}
