var R = require('ramda');
var q = require('q');

var promiseFlow = function promiseFlow () { // Variadic. Args are ordered fns used to build promise chain.
	var pChain = q(null);
	R.map(function mapPromises(nextLinkVal) {
		var nextPromiseLink = R.ifElse(R.is(Function), R.identity, R.always);
		pChain = pChain.then(nextPromiseLink(nextLinkVal));
	}, Array.prototype.slice.call(arguments));
	return pChain;
};

var identityFlow = function (entity) {
	R.ifElse(R.is(Function), R.identity, R.always);
};

var flowForms = [
	[
		R.either(R.is(Function), R.complement(R.isArrayLike)),
		identityFlow
	]
];

var lazyFlowForms = R.map(R.pipe(R.nth(1), R.partial(R.partial)));

var FormFlowEvalSwitch = R.cond(lazyFlowForms(flowForms));






