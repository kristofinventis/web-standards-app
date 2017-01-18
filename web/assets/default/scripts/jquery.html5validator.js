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
        if ( this.options.disableBrowserValidation ) {
            this.element.noValidate = true;
        }

        if (this.options.liveValidation) {
            $('input, select').on('blur', function (e) {
                this.validateElement(e.target);
            }.bind(this));
        }

        // Bind submit event
        $(this.element).submit($.proxy( this.onFormSubmit, this ));
        // $('button').click($.proxy( this.onFormSubmit, this ));
    };

    Plugin.prototype.validateElement = function (el) {
        var $el = $(el);

        this.hideError($el);

        // validation rules set in the config
        if ( this.options.fields ) {
            for ( field in this.options.fields ) {
                // check if the field exists
                if ( $el.is('[name=' + field + ']') ) {
                    // extract validator rules
                    var rules = this.options.fields[field].split('|');
                    for ( i in rules ) {
                        this.validate(rules[i], $el);
                    }
                }
            }
        }

        if ( this.options.disableAutoValidation ) {
            return;
        }

        if ($el.is('input[type!=checkbox][required]:enabled, textarea[required]:enabled, select[required]')) {
            this.validate('required', $el);
        }
        if ($el.is('input[type=checkbox][required]:enabled, input[type=radio][required]:enabled')) {
            this.validate('requiredCheckbox', $el);
        }
        if ($el.is('input[minlength]:enabled')) {
            this.validate('minlength', $el);
        }
        if ($el.is('input[maxlength]:enabled')) {
            this.validate('maxlength', $el);
        }
        if ($el.is('input[type=email]:enabled')) {
            this.validate('email', $el);
        }
        if ($el.is('input[type=tel]:enabled')) {
            this.validate('tel', $el);
        }
        if ($el.is('input[type=min]:enabled')) {
            this.validate('min', $el);
        }
        if ($el.is('input[type=max]:enabled')) {
            this.validate('max', $el);
        }
    };

    Plugin.prototype.onFormSubmit = function() {
        this.isValid = false;
        this.visibleErrors = [];
        this.validationErrors = [];
        this.hideErrors();

        $('input, select').each(function (index, el) {
            this.validateElement(el);
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
        if (elements.length == 0 ) return false;

        validatorRule = rule.split(':')[0];

        // check if the validator exists
        if ( this.validators[rule] ) {
            elements.each( $.proxy( function(index, el) {
                if ( !this.validators[validatorRule]( el, rule.split(':') ) ) {
                    this.showError({
                        element: $(el),
                        type: validatorRule
                    });
                    this.validationErrors.push({
                        element: $(el),
                        type: validatorRule
                    });
                }
            }, this ) );
        } else {
            console.log('validator "' + rules[i] + '" not found!');
        }
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

    Plugin.prototype.showError = function(errorObject) {
        // we only show the first error per element
        if ( $.inArray( errorObject.element.attr('name'), this.visibleErrors ) != -1 ) {
            return false;
        }
        //this.visibleErrors.push(errorObject.element.attr('name'));

        // default error message
        var message = this.options.messages[errorObject.type];

        // check for a custom error message on the element
        if ( errorObject.element.data( errorObject.type + '-error' ) ) {
            message = errorObject.element.data( errorObject.type + '-error' );
        }

        // set attribute value on placeholder
        if (message.search('%1') != -1) {
            message = message.replace('%1$s', errorObject.element.attr(errorObject.type));
        }

        // check for a custom function to show the error
        if ( typeof( this.options.showError ) == 'function' ) {
            var errorElement =  this.options.showError( errorObject.element, errorObject.type, message );
        } else {
            // fallback to the default action
            errorObject.element.parents(this.options.fieldParentSelector).first().addClass('-invalid');

            if ( message ) {
                var errorElement = $('<span />').addClass(this.options.errorMessageClass).text(message);
                errorObject.element.parents(this.options.fieldParentSelector).first().append( errorElement );
            }
        }

        this.errorElements.push( errorElement );
    };

    Plugin.prototype.hideErrors = function() {
        $(this.errorElements).each(function( index, el ) { $(el).remove(); });
        this.errorElements = [];

        // check for a custom function to show the error
        if ( typeof( this.options.hideErrors ) == 'function' ) {
            this.options.hideErrors();
        } else {
            $('.form__entry.-invalid', this.element).removeClass('-invalid');
        }
    };

    Plugin.prototype.hideError = function ($el) {
        var $parent = $el.parents(this.options.fieldParentSelector).first();

        $('.' + this.options.errorMessageClass, $parent).remove();
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