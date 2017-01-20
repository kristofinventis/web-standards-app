/*!
 * HTML5validator
 * Based on https://github.com/Inventis/html5validator with pull requests included
 */
;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = 'html5validator',
        defaults = {
            disableBrowserValidation: true,
            disableAutoValidation: false,
            liveValidation: true,
            messages: {
                required: 'This field is required',
                requiredCheckbox: 'This field is required',
                minlength: 'The minimum length of this field is not met',
                maxlength: 'The content of this field is too long',
                email: 'This is not an email address',
                tel: 'This is not an phone number',
                min: 'The number must be at least %1$s or larger',
                max: 'The number must be %1$s or smaller'
            },
            customValidators: {},
            fieldParentSelector: '.form__entry',
            errorMessageClass: 'form__message'
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        this.options = $.extend( {}, defaults, options );
        if ( options && options.messages ) {
            this.options.messages = $.extend( {}, defaults.messages, options.messages );
        }

        this._defaults = defaults;
        this._name = pluginName;

        this.isValid = false;
        this.validationErrors = [];
        this.errorElements = [];

        this.validators = $.extend( {}, this.validators, this.options.customValidators );

        this.init();
    }

    Plugin.prototype.init = function () {
        // Browser validation
        if (this.options.disableBrowserValidation) {
            this.element.noValidate = true;
        }

        if (this.options.liveValidation) {
            $('input, select').on('blur', function (e) {
                var failedValidationRule = this.getFailedValidationRuleForElement(e.target);
                if (failedValidationRule) {
                    this.showError($(e.target), failedValidationRule);
                } else {
                    this.hideError($(e.target));
                }
            }.bind(this));
        }

        // Bind submit event
        $(this.element).submit($.proxy( this.onFormSubmit, this ));
        // $('button').click($.proxy( this.onFormSubmit, this ));
    };

    Plugin.prototype.getFailedValidationRuleForElement = function (el) {

        var $el = $(el),
            failedValidationRule;

        // validation rules set in the config
        if (this.options.fields) {
            for (field in this.options.fields) {
                // check if the field exists
                if ($el.is('[name=' + field + ']')) {
                    // extract validator rules
                    var rules = this.options.fields[field].split('|');
                    for (i in rules) {
                        if (this.validate(rules[i], $el) !== true) {
                            return this.validate(rules[i], $el);
                        }
                    }
                }
            }
        }

        if (!this.options.disableAutoValidation) {
            if ($el.is('input[type!=checkbox][required]:enabled, textarea[required]:enabled, select[required]') && this.validate('required', $el) !== true) {
                return 'required';
            }
            if ($el.is('input[type=checkbox][required]:enabled, input[type=radio][required]:enabled') && this.validate('requiredCheckbox', $el) !== true) {
                return 'requiredCheckbox';
            }
            if ($el.is('input[minlength]:enabled') && this.validate('minlength', $el) !== true) {
                return 'minlength';
            }
            if ($el.is('input[maxlength]:enabled') && this.validate('maxlength', $el) !== true) {
                return 'maxlength';
            }
            if ($el.is('input[type=email]:enabled') && this.validate('email', $el) !== true) {
                return 'email';
            }
            if ($el.is('input[type=tel]:enabled') && this.validate('tel', $el) !== true) {
                return 'tel';
            }
            if ($el.is('input[type=min]:enabled') && this.validate('min', $el) !== true) {
                return 'min';
            }
            if ($el.is('input[type=max]:enabled') && this.validate('max', $el) !== true) {
                return 'max';
            }
        }

        return false;
    };

    Plugin.prototype.onFormSubmit = function() {
        this.isValid = false;
        this.visibleErrors = [];
        this.validationErrors = [];
        this.hideErrors();

        $('input, select').each(function (index, el) {
            var failedValidationRule = this.getFailedValidationRuleForElement(e.target);
            if (failedValidationRule) {
                this.showError($(el), failedValidationRule);
            } else {
                this.hideError($(el));
            }
        }.bind(this));

        if ( this.validationErrors.length > 0) {
            $(this.element).trigger('failed');
            this.validationErrors[0].element.focus();
            return false;
        }

        if ( typeof( this.options.success ) == 'function' ) {
            return this.options.success();
        }

        return true;
    };

    Plugin.prototype.validate = function( rule, elements ) {
        var failedValidationRule;
        if (elements.length == 0 ) return false;

        validatorRule = rule.split(':')[0];

        // check if the validator exists
        if ( this.validators[rule] ) {
            elements.each( $.proxy( function(index, el) {
                if ( !this.validators[validatorRule]( el, rule.split(':') ) ) {
                    failedValidationRule = validatorRule;
                }
            }, this ) );
        } else {
            console.log('validator "' + rules[i] + '" not found!');
        }

        return failedValidationRule ? failedValidationRule : true;
    }

    Plugin.prototype.validators = {
        required: function( el ) {
            if ( !$(el).val() ) {
                return false;
            }
            return true;
        },
        requiredCheckbox: function( el ) {
            var name = $(el).data('group'),
                success = true;
            // when data-group attr we're gonna check the whole group, so skip this check
            if (!el.checked && name === undefined) {
                return false;
            }

            if (name !== undefined) {
                success = false;
                $('input[data-group="' + name + '"]').each(function (index, element) {
                    if (element.checked) {
                        success = true;
                    }
                })
            }

            return success;
        },
        minlength: function( el, arguments ) {
            if ( arguments.length > 1  && arguments[1] <= $(el).val().length ) {
                return true;
            } else if ( $(el).attr('minlength') <= $(el).val().length ) {
                return true;
            }

            return false;
        },
        maxlength: function( el, arguments ) {
            if ( arguments.length > 1  && arguments[1] > $(el).val().length ) {
                return true;
            } else if ( $(el).attr('maxlength') > $(el).val().length ) {
                return true;
            }

            return false;
        },
        email: function( el ) {
            var regEx = /^([\w-\.\+]+@([\w-]+\.)+[\w-]{2,4})?$/;
            return regEx.test( $(el).val() );
        },
        tel: function (el) {
            if ($(el).val().length == 0) {
                return true;
            }
            var regEx = /^[\+]?[\d]{9,13}$/;
            return regEx.test($(el).val());
        },
        min: function( el, arguments ) {
            if ( parseInt($(el).attr('min')) <= parseInt($(el).val()) ) {
                return true;
            }
            return false;
        },
        max: function( el, arguments ) {
            if ( parseInt($(el).attr('max')) >= parseInt($(el).val()) ) {
                return true;
            }
            return false;
        }

    };

    Plugin.prototype.showError = function(element, type) {
        // default error message
        var message = this.options.messages[type];

        // check for a custom error message on the element
        if ( element.data( type + '-error' ) ) {
            message = element.data( type + '-error' );
        }

        // set attribute value on placeholder
        if (message.search('%1') != -1) {
            message = message.replace('%1$s', element.attr(type));
        }

        // check for a custom function to show the error
        if ( typeof( this.options.showError ) == 'function' ) {
            return this.options.showError( element, type, message );
        }

        // fallback to the default action
        var $parent = element.parents(this.options.fieldParentSelector).first(),
            errorElement = $parent.children('.' + this.options.errorMessageClass);

        $parent.addClass('-invalid');

        if ( !message ) {
            return;
        }

        if (errorElement.length) {
            errorElement.text(message);
        } else {
            errorElement = $('<span />').addClass(this.options.errorMessageClass).text(message);
            $parent.append( errorElement );
        }
    };

    Plugin.prototype.hideError = function ($el) {
        var $parent = $el.parents(this.options.fieldParentSelector).first(),
            $message = $('.' + this.options.errorMessageClass, $parent);

        // $('.' + this.options.errorMessageClass, $parent).remove();
        $message.addClass('-hide');
        setTimeout(function(){
            $message.remove();
        }, 710);
        $parent.removeClass('-invalid');
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                    new Plugin( this, options ));
            }
        });
    }

})( jQuery, window, document );
