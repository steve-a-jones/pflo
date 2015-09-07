var r = require('ramda');
var q = require('q');

var pCall      = r.bind(q.fcall, q);
var All        = r.bind(q.all, q);
var asList     = function (x) { return [].concat(x) };

var args2List = function (x) {
	return Array.prototype.slice.call(x);
};

var tap = r.tap(function () {
	console.log('tap : ', arguments);
});

var asPThunk          = r.ifElse(r.is(Function), r.identity, r.always);
var mapListToPThunks  = r.pipe(asList, r.map(asPThunk))     ;
var mapListToPromises = r.pipe(mapListToPThunks, r.map(pCall));

var mapListToPromiseSeq = function (seqList) {
	var pThunks = mapListToPThunks(seqList);

	return r.reduce(function (floChain, fn) {
		return floChain.then(fn);
	}, q(r.head(pThunks)()), r.tail(pThunks));
};

var isCondFlo    = r.pipe(r.head, r.isArrayLike);
var isPartialFlo = r.pipe(r.head, r.is(Function));

var identityFlo = function (pEntity) {
	return function (initVal) {
		return q(asPThunk(initVal)()).then(asPThunk(pEntity));
	};
};

var partialFlo = function (partialForm) {
	return function (initVal) {
		var fn            = r.head(partialForm);
		var fnPartialArgs = r.tail(partialForm);
		var fnLitArgs     = r.ifElse(r.equals(undefined), r.always(fnPartialArgs), r.append(r.__, fnPartialArgs));
		var fnPArgs       = mapListToPromises(fnLitArgs(initVal));
		return All(mapListToPromises(fnPArgs)).spread(fn);
	};
};

var condFlo = function (form) {

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
	[function (x) { console.log('arguments', arguments); return x; }, _export(xP), xP],
	[function (one, two, three) { console.log(one, two, three); return [three, two, one]}, r.always('one'), r.always('two')],
	[tap]
);


