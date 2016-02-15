/* global require, define */
define([], function () {
    "use strict";

    var FIELD_INVALID_CLASS = 'form__entry--invalid',
        FIELD_MESSAGE_CLASS = 'form__message';

    var Field = function (el, rules) {
        this.el = el;
        this.rules = rules;
        this.failedRule = undefined;

        this.el.addEventListener('blur', this.validate.bind(this));
    };

    Field.prototype.getElement = function () {
        return this.el;
    };

    Field.prototype.getParent = function () {
        return this.el.parentNode;
    };

    Field.prototype.validate = function () {
        this.getParent().classList.remove(FIELD_INVALID_CLASS);

        if (!this.isValid()) {
            this.getParent().classList.add(FIELD_INVALID_CLASS);
            this.showMessage(this.getValidationMessage());

            return false;
        } else {
            this.removeMessage();

            return true;
        }
    };

    Field.prototype.isValid = function () {
        var i, length = this.rules.length, rule, options;

        for (i=0; i<length; i++) {
            if (!this.rules[i].validate(this.el.value)) {
                this.failedRule = this.rules[i];
                return false;
            }
        }

        return true;
    };

    Field.prototype.getValidationMessage = function () {
        if (!this.failedRule) {
            return false;
        }

        var message = this.el.getAttribute('data-validation-' + this.failedRule.getName() + '-message');

        if (!message && this.options && this.options.message) {
            return this.options.message;
        }

        return this.failedRule.getMessage(this.el.value);
    };

    Field.prototype.removeMessage = function () {
        var messageEl;
        if (messageEl = this.getParent().querySelector('.' + FIELD_MESSAGE_CLASS)) {
            this.getParent().removeChild(messageEl);
        }
    };

    Field.prototype.showMessage = function (message) {
        if (this.getParent().querySelector('.' + FIELD_MESSAGE_CLASS)) {
            return;
        }

        var messageEl = document.createElement('div');
        messageEl.className = FIELD_MESSAGE_CLASS;
        messageEl.innerHTML = message;

        this.getParent().appendChild(messageEl);
    };

    return Field;
});
