/* global require, define */
define(
    [
        'jquery',
        'Application/Components/FormValidator/Field',
        'Application/Components/FormValidator/Rule'
    ],
    function ($, Field, Rule) {
        "use strict";

        var Validator = function (form, config) {
            this.form = form;
            this.config = {
                fields: [],
                validationMessageOverrides: undefined,
                autoDetect: true
            };
            this.fields = [];

            $.extend(this.config, config);

            var validationMessages = {
                REQUIRED: 'Dit veld is verplicht in the vullen',
                MAXLENGTH: 'Dit veld mag max {0} karakters bevatten'
            };
            if (this.config.validationMessageOverrides) {
                $.extend(validationMessages, this.config.validationMessageOverrides);
            }

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

            if (this.config.fields) {
                this.createFieldsBasedOnRules();
            }
            if (this.config.autoDetect) {
                this.autoDetectFields();
            }

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

        Validator.prototype.autoDetectFields = function () {
            $('[required]', this.form).each(function (index, field) {
                var validationRule = Object.create(this.rules['required']);
                this.fields.push(new Field(field, [validationRule]));
            }.bind(this));

            var i = 0, length = this.rules.length;
            for (i=0; i<=length; i++) {
                this.rules[i].detect(this.form);
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
