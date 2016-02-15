/* global require, define */
define(
    [
        'jquery',
        'Application/Components/FormValidator/Field',
        'Application/Components/FormValidator/Rule'
    ],
    function ($, Field, Rule) {
        "use strict";

        var Validator = function (form, config, validationMessageOverrides) {
            this.form = form;
            this.config = config;
            this.fields = [];


            var validationMessages = {
                REQUIRED: 'Dit veld is verplicht in the vullen',
                MAXLENGTH: 'Dit veld mag max {0} karakters bevatten'
            };
            $.extend(validationMessages, validationMessageOverrides);

            this.rules = {
                required: new Rule(
                    'required',
                    function (value) {
                        return value.length > 0;
                    },
                    validationMessages.REQUIRED
                ),
                'max-length': new Rule(
                    'max-length',
                    function (value, options) {
                        return value.length < options.length;
                    },
                    function (value, options) {
                        return validationMessages.MAXLENGTH.replace('{0}', options.length);
                    }
                )
            };

            this.createFieldsBasedOnRules();

            this.form.setAttribute('novalidate', true);
            this.form.addEventListener('submit', this.validateForm.bind(this));
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

        Validator.prototype.createField = function (fieldName, rulesConfig) {
            var field = this.form.querySelector("[name='" + fieldName + "']");

            if (!field) {
                return false;
            }

            var i, length = rulesConfig.length, rule, options, rules = [];

            for (i=0; i<length; i++) {
                rule = rulesConfig[i];
                options = undefined;

                if (typeof rule == 'object') {
                    options = rule[1];
                    rule = rule[0];
                }

                if (typeof this.rules[rule] != 'undefined') {
                    var validationRule = Object.create(this.rules[rule]);
                    validationRule.setOptions(options);
                    rules.push(validationRule);
                }
            }

            return new Field(field, rules);
        };

        Validator.prototype.validateForm = function (e) {
            var i,
                length = this.fields.length;

            for (i=0; i<length; i++) {
                if (!this.fields[i].validate()) {
                    e.preventDefault();
                    this.fields[i].getElement().focus();
                    return;
                }
            }
        };

        Validator.prototype.formatString = function () {
            var formatted = arguments[0];
            for (var i = 1; i < arguments.length; i++) {
                var regexp = new RegExp('\\{'+i+'\\}', 'gi');
                formatted = formatted.replace(regexp, arguments[i]);
            }
            return formatted;
        };

        return Validator;
    }
);
