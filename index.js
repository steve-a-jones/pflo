var r = require('ramda');
var q = require('q');

var args2List = Array.prototype.slice.call;

var promiseFlow = function promiseFlow (pChainList) {
	return r.reduce(q.when, q(null), pChainList);
};

var nextThenPLink = r.ifElse(r.is(Function), r.identity, r.always);

var identityFlo = function (form) {
	r.ifElse(r.is(Function), r.identity, r.always);
};

var isCondFlo     = r.pipe(r.nth(0), r.isArrayLike);
var isPartialFlo  = r.pipe(r.nth(0), r.is(Function));

var condFlo = function (form) {

};

var partialFlo = function () {
	var args = args2List(arguments);
	return function () {
		return q.all(mapListToPromises(r.tail(args))).spread(r.head(args));
	};
};

var specialFormFlo = r.cond([
	[isPartialFlo, partialFlo],
	[isCondFlo, condFlo]
]);

var isSpecialFormKey = r.equals('*');
var isSpecialFormFlo = r.both(r.isArrayLike, r.pipe(r.nth(0), isSpecialFormKey));
var isIdentityFlo    = r.either(r.is(Function), r.complement(isSpecialFormFlo));

var floForms = [
	[isIdentityFlo, identityFlo],
	[isSpecialFormFlo, r.pipe(r.tail, specialFormFlo)]
];

var Pflo = r.map(r.cond(floForms));

var _export = function () {
	var pfloList = args2List(arguments);





	return q.Promise(function (res, rej) {
		var pflo = Pflo(pfloList);


		//var lazyEvalFloList = function () {
		//
		//};
		//
		//var floListEvalComplete = function (err, data) {
		//
		//};
		//
		//a.eachLimit(floList, 1, );
	});
};



