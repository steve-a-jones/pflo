var r = require('ramda');
var q = require('q');
var test = require('tape');
var pflo = require('../index');
var underTestObj = pflo.underTest();
var args2ListTest = function () {
    return underTestObj.args2List(arguments);
};
var arr = [];
var pfloFuncTest = r.always("bar");
var pfloFuncTest2 = r.always(456);
var log = function (x) {
    return arr.push(x); 
};
var pfloTest = function (x, y) {
	return pflo(
		log(x),
		log(y)
	);
};

test('testing asList function', function (t) {
    t.plan(2);
    t.equal(typeof underTestObj.asList, 'function', 'should be a function');
    t.deepEqual(underTestObj.asList('foo'), ['foo'], 'should be equal to "foo"');
});

test('testing args2List', function (t) {
    t.plan(2);
    t.equal(typeof underTestObj.args2List, 'function', 'should be a function');
    t.deepEqual(args2ListTest(1, 2, 3), [1, 2, 3], 'should take args 1, 2, 3 and make an array [1, 2, 3]');
});

test('testing mapToPfloForms', function (t) {
    t.plan(1);
    t.equal(typeof underTestObj.mapToPfloForms, 'function', 'should be a function');
    // needs more tests?
});

test('testing mapListToPromiseSeq', function (t) {
    t.plan(1);
    t.equal(typeof underTestObj.mapListToPromiseSeq, 'function', 'should be a function');
    // needs more tests?
});

test('testing pflo with primitive arguments: string and number', function (t) {
    pfloTest("foo", 123);
    t.plan(2);
    t.equal(typeof pflo, 'function', 'should be a function');
    t.deepEqual(arr, ["foo", 123], 'should be equal to the arr ["foo", 123]');
});

test('testing pflo with functions as arguments', function (t) {
    pfloTest(pfloFuncTest, pfloFuncTest2);
    t.plan(1);
    t.deepEqual(arr, ["foo", 123, pfloFuncTest, pfloFuncTest2], 'should be equal to the arr ["foo", 123, pfloFuncTest, pfloFuncTest2');
});
