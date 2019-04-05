
const assert = require('assert');
const klopptions = require('../klopptions');

describe('default setup', function() {

    it('should reject unrecognized flags', function() {
        assert.throws( () => klopptions({ args: ['-x'] }), Error, 'Fails' );
    });

    it('should reject standalone options', function() {
        assert.throws( () => klopptions({ args: ['--xxx'] }), Error, 'Fails' );
    });

    it('should record option values', function() {
        const { xxx } = klopptions({ args: ['--xxx','XXX'] });
        assert.equal( xxx, 'XXX' );
    });

    it('should return trailing arguments', function() {
        const testArgs = ['XXX','YYY'];
        const { args } = klopptions({ args: testArgs });
        assert.deepEqual( args, testArgs );
    });

    it('should allow argv as a synonym for args', function() {
        const testArgs = ['XXX','YYY'];
        const { args } = klopptions({ argv: testArgs });
        assert.deepEqual( args, testArgs );
    });
});

describe('flags', function() {

    it('should map flags to option names', function() {
        const flags = { '-x': 'xxx' };
        const { xxx } = klopptions({
            args: ['-x', '123' ],
            flags
        });
        assert.equal( xxx, '123');
    });

});

describe('switches', function() {

    it('should map flags to switch values', function() {
        const flags = { '-x': 'xxx' };
        const switches = { 'xxx': '123' };
        const { xxx } = klopptions({
            args: ['-x'],
            flags,
            switches
        });
        assert.equal( xxx, '123');
    });
});

describe('positional arguments', function() {

    it('should map positional arguments', function() {
        const positional = ['one','two'];
        const { one, two } = klopptions({
            args: ['111','222'],
            positional
        });
        assert.equal( one, '111');
        assert.equal( two, '222');
    });

    it('should reject trailing positionals', function() {
        const positional = ['one'];
        assert.throws( () => klopptions({ args: ['111','222'], positional }), Error, 'Fails' );
    });

    it('should handle varargs', function() {
        const positional = ['one','...other'];
        const { one, other } = klopptions({
            args: ['111','aaa','bbb'],
            positional
        });
        assert.equal( one, '111');
        assert.deepEqual( other, ['aaa','bbb']);
    });

});


