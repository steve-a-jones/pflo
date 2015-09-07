var r = require('ramda');
var q = require('q');

var pCall      = r.bind(q.fcall, q);
var All        = r.bind(q.all, q);
//var When       = r.when()
var asList     = function (x) { return [].concat(x) };

var args2List = function (x) {
	return Array.prototype.slice.call(x);
};

var tap = r.tap(function () {
	console.log('tap : ', arguments);
});

var nextThenPLink       = r.ifElse(r.is(Function), r.identity, r.always);
var mapListToPThunks    = r.pipe(asList, r.map(nextThenPLink));
var mapListToPromises   = r.pipe(mapListToPThunks, r.map(pCall));

var mapListToPromiseSeq = function (seqList) {
	return r.reduce(function (floChain, fn) {
		return floChain.then(fn);
	}, q(null), mapListToPThunks(seqList));
};

var isCondFlo    = r.pipe(r.head, r.isArrayLike);
var isPartialFlo = r.pipe(r.head, r.is(Function));

var identityFlo = function (pEntity) {
	console.log('identity flo..');
};

var condFlo = function (form) {

};

var partialFlo = function (partialForm) {
	return function (initVal) {
		var fn        = r.head(partialForm);
		var fnLitArgs = r.append(initVal, r.tail(partialForm));
		var fnPArgs   = mapListToPromises(fnLitArgs);
		return All(mapListToPromises(fnPArgs)).spread(fn);
	};
};

var specialFormFlo = r.cond([
	[isPartialFlo, partialFlo],
	[isCondFlo, condFlo]
]);

var isSpecialFormFlo = r.both(r.isArrayLike, r.pipe(r.nth(0), r.either(r.isArrayLike, r.is(Function))));
var isIdentityFlo    = r.either(r.is(Function), r.complement(isSpecialFormFlo));

var floForms = [
	[isIdentityFlo, identityFlo],
	[isSpecialFormFlo, specialFormFlo]
];

var Pflo = r.map(r.cond(floForms));

var _export = function _export () {
	return r.pipe(
		args2List,
		Pflo,
		mapListToPromiseSeq
	)(arguments);
};

var xP = function () {
	return q.Promise(function (res, rej) {
		setTimeout(function () {
			res('three');
		}, 1000)
	});
};

_export(
	[function (x) { return x; }, xP],
	[function (one, two, three) { console.log(one, two, three); return [three, two, one]}, r.always('one'), r.always('two')],
	[tap]
);


