var test = require('tape');
var plfo = require('../index');
var underTestObj = plfo.underTest();
var args2ListTest = function () {
    return underTestObj.args2List(arguments);
};

test('testing asList function', function (t) {
    t.plan(2);
    t.equal(typeof underTestObj.asList, 'function', 'should be a function');
    t.deepEqual(underTestObj.asList('foo'), ['foo'], 'should be equal to "foo"');
});

test('testing args2List', function (t) {
    t.plan(2);
    t.equal(typeof underTestObj.args2List, 'function', 'should be a function');
    t.deepEqual(args2ListTest(1, 2, 3), [1, 2, 3], 'should take args and make an array');
});

test('testing mapToPfloForms', function (t) {
    t.plan(1);
    t.equal(typeof underTestObj.mapToPfloForms, 'function', 'should be a function');
});

test('testing mapListToPromiseSeq', function (t) {
    t.plan(1);
    t.equal(typeof underTestObj.mapListToPromiseSeq, 'function', 'should be a function');
});
