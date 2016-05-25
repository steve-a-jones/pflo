var r = require('ramda');
var q = require('q');

var pCall = r.bind(q.fcall, q);
var All = r.bind(q.all, q);
var asList = function(x) {
    return [].concat(x)
};

var args2List = function(x) {
    return Array.prototype.slice.call(x);
};

var asPThunk = r.ifElse(r.is(Function), r.identity, r.always);
var mapListToPThunks = r.pipe(asList, r.map(asPThunk));
var mapListToPromises = r.pipe(mapListToPThunks, r.map(pCall));

var mapListToPromiseSeq = function(seqList) {
    var pThunks = mapListToPThunks(seqList);
    return r.reduce(function(floChain, fn) {
        return floChain.then(fn);
    }, q(r.head(pThunks)()), r.tail(pThunks));
};

//var isCondFlo    = r.pipe(r.head, r.isArrayLike);
var isPartialFlo = r.pipe(r.head, r.is(Function)); // returns a Boolean

var identityFlo = function(pEntity) {
    return function(initVal) {
        return q(initVal).then(asPThunk(pEntity));
    };
};

var partialFlo = (function() {
    var updateArgsWithPartialVal = function(placeHolderIdx, partialVal, fnPartialArgs) {
        var pArgsMinusPlaceholder = r.remove(placeHolderIdx, 1, fnPartialArgs);
        return r.insert(placeHolderIdx, partialVal, mapListToPromises(pArgsMinusPlaceholder));
    };

    var appendPartialValToArgs = function(partialVal, fnPartialArgs) {
        var pList = mapListToPromises(fnPartialArgs);
        return typeof partialVal === 'undefined' ? pList : r.append(partialVal, pList);
    };

    return function(partialForm) {
        return function(partialVal) {
            var fn = r.head(partialForm);
            var fnPartialArgs = r.tail(partialForm);
            var placeHolderIdx = r.findIndex(r.equals('__'), fnPartialArgs);
            var hasPlaceholder = r.gt(placeHolderIdx, -1);
            var finalArgs = hasPlaceholder ? updateArgsWithPartialVal(placeHolderIdx, partialVal, fnPartialArgs) : appendPartialValToArgs(partialVal, fnPartialArgs);
            return All(finalArgs).spread(fn);
        }
    };
}());

var specialFormFlo = r.cond([
    [isPartialFlo, partialFlo]
]);

var isSpecialFormFlo = r.both(r.isArrayLike, r.pipe(r.nth(0), r.either(r.isArrayLike, r.is(Function))));
// r.both: Note that this is short-circuited, meaning that the second function will not be invoked if the first returns a false-y value.
var isIdentityFlo = r.either(r.is(Function), r.complement(isSpecialFormFlo));
// r.either: Note that this is short-circuited, meaning that the second function will not be invoked if the first returns a truth-y value.

var floForms = [
    [isIdentityFlo, identityFlo],
    [isSpecialFormFlo, specialFormFlo]
];

var mapToPfloForms = r.map(r.cond(floForms)); // returns a function that takes a list

module.exports = function pflo() {
    return r.pipe(
        args2List,
        mapToPfloForms,
        mapListToPromiseSeq
    )(arguments);
};

module.exports.underTest = function() {
    return {
        asList: asList,
        args2List: args2List,
        mapToPfloForms: mapToPfloForms,
        mapListToPromiseSeq: mapListToPromiseSeq
    };
};
