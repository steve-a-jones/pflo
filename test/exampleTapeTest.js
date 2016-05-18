var r = require('ramda');
var q = require('q');
var test = require('tape');
var pflo = require('../index');
var underTestObj = pflo.underTest();
var args2ListTest = function () {
    return underTestObj.args2List(arguments);
};
var bar = function () {
    setTimeout(function () {
        console.log("bar");
    }, 500);
};
var baz = function () {
    setTimeout(function () {
        console.log("baz");
    }, 1000);
};
var qux = function () {
    return pflo(bar, baz);
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

test('testing pflo', function (t) {
    t.plan(1);
    t.equal(typeof pflo, 'function', 'should be a function');
});
