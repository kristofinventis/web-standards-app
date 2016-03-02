/* global require, define */
define([], function () {
    "use strict";

    var Rule = function (name, validationCallback, message, selector) {
        this.name = name;
        this.options = undefined;
        this.validationCallback = validationCallback;
        this.message = message;
        this.selector = selector;
    };

    Rule.prototype.getName = function () {
        return this.name;
    };

    Rule.prototype.setOptions = function (options) {
        this.options = options;
    };

    Rule.prototype.validate = function (value) {
        return this.validationCallback.apply(this, [value, this.options]);
    };

    Rule.prototype.getMessage = function (value) {
        if (typeof this.message == 'function') {
            return this.message.apply(this, [value, this.options]);
        }

        return this.message;
    };

    Rule.prototype.getSelector = function () {
        return this.selector;
    };

    return Rule;
});
