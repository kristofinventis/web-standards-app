/* global require, define */
define(['jquery'], function ($) {
    "use strict";

    var FIELD_INVALID_CLASS = 'form__entry--invalid';

    var Rules = {
        required: function (value, options) {
            return value.length > 0;
        },
        'max-length': function (value, options) {
            return value.length < options.length;
        }
    };

    var Validator = function (form, config) {
        this.form = form;
        this.config = config;
        this.fields = [];

        this.createFieldsBasedOnRules();

        // add form submit listener
    };

    Validator.prototype.createFieldsBasedOnRules = function () {
        var fields = this.config.fields,
            field,
            fieldName;

        if (!fields) {
            return false;
        }

        for (fieldName in fields) {
            if (!fields.hasOwnProperty(fieldName)) {
                continue;
            }

            field = this.createField(fieldName, fields[fieldName]);
            if (field) {
                this.fields.push(field);
            }
        }
    };

    Validator.prototype.createField = function (fieldName, rules) {
        var field = this.form.querySelector("[name='" + fieldName + "']");

        if (!field) {
            return false;
        }

        return new Field(field, rules);
    };

    var Field = function (el, rules) {
        this.el = el;
        this.rules = rules;
        this.failedRule;

        this.el.addEventListener('blur', this.validate.bind(this));
    };

    Field.prototype.validate = function () {
        this.el.parentNode.classList.remove(FIELD_INVALID_CLASS);

        if (!this.isValid()) {
            this.el.parentNode.classList.add(FIELD_INVALID_CLASS);
            console.log(this.getValidationMessage());
        }
    };

    Field.prototype.isValid = function () {
        var i, length = this.rules.length, rule, options;

        for (i=0; i<length; i++) {
            rule = this.rules[i];
            options = undefined;

            if (typeof rule == 'object') {
                options = rule[1];
                rule = rule[0];
            }

            if (typeof Rules[rule] != 'undefined' && !Rules[rule](this.el.value, options)) {
                this.failedRule = rule;
                return false;
            }
        }

        return true;
    };

    Field.prototype.getValidationMessage = function () {
        // check for data-attr
        // check for rule
        // fallback on general translation
    }

    return Validator;
});
