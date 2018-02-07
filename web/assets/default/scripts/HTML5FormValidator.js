/*!
 * HTML5FormValidator
 */
;(function() {
    // Function that extends an object with another object
    // Pass in the objects to merge as arguments.
    // For a deep extend, set the first argument to `true`.
    var extend = function () {
        // Variables
        var extended = {};
        var deep = false;
        var i = 0;
        var length = arguments.length;

        // Check if a deep merge
        if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
            deep = arguments[0];
            i++;
        }

        // Merge the object into the extended object
        var merge = function (obj) {
            for ( var prop in obj ) {
                if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
                    // If deep merge and property is an object, merge properties
                    if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
                        extended[prop] = extend( true, extended[prop], obj[prop] );
                    } else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };

        // Loop through each object and conduct a merge
        for ( ; i < length; i++ ) {
            var obj = arguments[i];
            merge(obj);
        }

        return extended;
    };

    // Element.matches Polyfill
    // For browsers that do not support Element.matches()
    // or Element.matchesSelector(), but carry support for document.querySelectorAll():
    if (!Element.prototype.matches) {
        Element.prototype.matches =
            Element.prototype.matchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector ||
            Element.prototype.oMatchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            function(s) {
                var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                    i = matches.length;
                while (--i >= 0 && matches.item(i) !== this) {}
                return i > -1;
            };
    }

    // Find nearest parrent with given selector
    var findParent = function (el, selector) {
        while ((el = el.parentElement) && !((el.matches || el.matchesSelector).call(el, selector)));
        return el;
    }


    // The defaults
    var defaults = {
        fieldParentSelector: '.form__entry',
        groupParentSelector: '.form__fieldset',
        errorMessageClass: 'form__message',
        showSuccess: false,
        successMessageClass: 'form__success',
        messages: {
            required:              'This field is required',
            requiredSelect:        'An option must be selected',
            requiredCheckbox:      'This field is required',
            requiredCheckboxgroup: 'At least one option must be selected',
            requiredRadiogroup:    'An option must be selected',
            password:              'Must have 1 lower- and uppercase letter, 1 number and 1 symbol',
            minlength:             'The minimum length of this field is not met',
            maxlength:             'The content of this field is too long',
            email:                 'This is not an email address',
            tel:                   'This is not an phone number',
            min:                   'The number must be at least %1$s or larger',
            max:                   'The number must be %1$s or smaller'
        }
    };

    // The constructor
    function HTML5FormValidator(element, options) {
        this.element = element;
        this.options = extend( {}, defaults, options );
        this.isValid = false;

        // Overwrite default messages with translations from formvalidator_translations if provided
        if ( options && options.messages ) {
            this.options.messages = extend( {}, defaults.messages, options.messages );
        }

        // Start it all
        this.init();
    }

    // Init
    HTML5FormValidator.prototype.init = function () {
        var isRequired = this.checkIfElementIsRequired(this.element);
        var validationRule = this.getValidationRuleOfElement(this.element);
        var ruleThatFailed = this.validate(this.element, validationRule);

        if (ruleThatFailed) {
            // Show error when validation failed
            this.showError(this.element, ruleThatFailed);
            if (this.options.showSuccess && isRequired) {
                this.hideSuccess(this.element);
            }

            return;
        }

        // If all is valid:
        // Also pass the ruleThatFailed, it determines the parent
        this.hideError(this.element);

        if (this.options.showSuccess && isRequired) {
            this.showSuccess(this.element);
        }

        this.isValid = true;
    };

    // Return the current validation rule needed for the element
    HTML5FormValidator.prototype.getValidationRuleOfElement = function (element) {
        // Validator rules:

        // Required
        if (element.matches('input:not([type=checkbox])[required]:enabled, textarea[required]:enabled') && this.validate(element, 'required')) {
            return 'required';
        }

        // Required
        if (element.matches('select[required]') && this.validate(element, 'requiredSelect')) {
            return 'requiredSelect';
        }

        // Checkbox
        if (element.matches('input[type=checkbox]:not([data-group])[required]:enabled') && this.validate(element, 'requiredCheckbox')) {
            return 'requiredCheckbox';
        }

        // Checkboxgroup
        if (element.matches('fieldset[required]:enabled input[type=checkbox]') && this.validate(element, 'requiredCheckboxgroup')) {
            return 'requiredCheckboxgroup';
        }

        // Radiogroup
        if (element.matches('fieldset[required]:enabled input[type=radio]') && this.validate(element, 'requiredRadiogroup')) {
            return 'requiredRadiogroup';
        }

        // minlength
        if (element.matches('input[type=password]:enabled') && this.validate(element, 'password')) {
            return 'password';
        }

        // minlength
        if (element.matches('input[minlength]:enabled') && this.validate(element, 'minlength')) {
            return 'minlength';
        }

        // maxlength
        if (element.matches('input[maxlength]:enabled') && this.validate(element, 'maxlength')) {
            return 'maxlength';
        }

        // email
        if (element.matches('input[type=email]:enabled') && this.validate(element, 'email')) {
            return 'email';
        }

        // tel
        if (element.matches('input[type=tel]:enabled') && this.validate(element, 'tel')) {
            return 'tel';
        }

        // min
        if (element.matches('input[type=min]:enabled') && this.validate(element, 'min')) {
            return 'min';
        }

        // max
        if (element.matches('input[type=max]:enabled') && this.validate(element, 'max')) {
            return 'max';
        }

        // if no rule is found, return false
        return false;
    };

    // Checks ff the element is required
    HTML5FormValidator.prototype.checkIfElementIsRequired = function (element) {
        // inputs, checkboxes, textareas and selects that are required
        if (element.matches('input[required]:enabled, textarea[required]:enabled, select[required]')) {
            return true;
        }

        // Radiogroups and checkboxgroups
        if (element.matches('fieldset[required]:enabled input')) {
            return true;
        }

        // if no rule is found, return false
        return false;
    };

    // Validate the element
    HTML5FormValidator.prototype.validate = function(element, rule) {
        // Return if rule is 'false'
        // This is here because the elements loop through all validator rules
        // at the end there will be no more validation rule...
        // Otherwise you'd get "validator false not found!"
        if (!rule) {
            return;
        }

        // check if the validator exists
        if (!this.validators[rule]) {
            // If not found just log it.
            // the element will pass as valid
            console.log('validator "' + rule + '" not found!');
            return;
        }

        // Check if element fails validation rule
        if (!this.validators[rule](element, rule)) {
            // return the failed rule
            return rule;
        }

        return;
    }

    // The different validators
    HTML5FormValidator.prototype.validators = {
        // required: check if not empty
        required: function (el) {
            if (!el.value) {
                return false;
            }
            return true;
        },
        requiredSelect: function (el) {
            if (el.selectedIndex === 0) {
                return false;
            }
            return true;
        },
        requiredCheckbox: function (el) {
            if (!el.checked) {
                return false;
            }

            return true;
        },
        requiredCheckboxgroup: function (el) {
            var group = el.dataset.group,
                siblings = document.querySelectorAll('[data-group='+group+']'),
                checked = false;

            // Loop all in group, if one is checked, set checked to true
            for (var i = 0; i < siblings.length; i++) {
                if (siblings[i].checked) {
                    checked = true;
                    break; // loop no longer needs to continue
                }
            }

            return checked;
        },
        requiredRadiogroup: function (el) {
            var name = el.name,
                siblings = document.querySelectorAll('[name='+name+']'),
                checked = false;

            // Loop all in group, if one is checked, set checked to true
            for (var i = 0; i < siblings.length; i++) {
                if (siblings[i].checked) {
                    checked = true;
                    break; // loop no longer needs to continue
                }
            }

            return checked;
        },
        password: function ( el ) {
            if (!el.required && el.value.length == 0) {
                return true;
            }

            var regExLowerCase = /[a-z]/;
            var regExUpperCase = /[A-Z]/;
            var regExNumber    = /\d/;
            var regExSymbols   = /[-@#§£!"$€%^&*()_+|~=`{}\[\]:";'<>?,.\/]/;

            var hasLowerCase = regExLowerCase.test(el.value);
            var hasUpperCase = regExUpperCase.test(el.value);
            var hasNumber    = regExNumber.test(el.value);
            var hasSymbols   = regExSymbols.test(el.value);

            if (hasLowerCase && hasUpperCase && hasNumber && hasSymbols) {
                return true;
            }

            return false;
        },
        minlength: function ( el, arguments ) {
            if ( arguments.length > 1  && arguments[1] <= el.value.length ) {
                return true;
            } else if ( el.getAttribute('minlength') <= el.value.length ) {
                return true;
            }

            return false;
        },
        maxlength: function ( el, arguments ) {
            if ( arguments.length > 1  && arguments[1] > el.value.length ) {
                return true;
            } else if ( el.getAttribute('maxlength') > el.value.length ) {
                return true;
            }

            return false;
        },
        email: function (el) {
            var regEx = /^([\w-\.\+]+@([\w-]+\.)+[\w-]{2,4})?$/;
            return regEx.test( el.value );
        },
        tel: function (el) {
            if (el.value.length == 0) {
                return true;
            }
            var regEx = /^[\+]?[\d]{9,13}$/;
            return regEx.test(el.value);
        },
        min: function ( el, arguments ) {
            if ( parseInt(el.getAttribute('min')) <= parseInt(el.value) ) {
                return true;
            }
            return false;
        },
        max: function( el, arguments ) {
            if ( parseInt(el.getAttribute('max')) >= parseInt(el.value) ) {
                return true;
            }
            return false;
        }

    };

    HTML5FormValidator.prototype.showError = function(element, type) {
        var message = this.options.messages[type], // default error message
            parent,
            errorElement;

        // Find the parent to later append the error message to
        if (type === "requiredCheckboxgroup" || type === "requiredRadiogroup") {
            parent = findParent(element, this.options.groupParentSelector);
        } else {
            parent = findParent(element, this.options.fieldParentSelector);
        }

        if (parent === null) {
            return;
        }

        // Find the errorElement
        errorElement = parent.querySelector('.' + this.options.errorMessageClass);

        // set attribute value on placeholder (mostly used for min and max values)
        if (message.search('%1') != -1) {
            message = message.replace('%1$s', element.getAttribute(type));
        }

        // Return if there's no message
        if (!message) {
            return;
        }

        // Set invalid class on parent
        parent.classList.add('-invalid');

        // Check if there is already an error message in the DOM
        if(!errorElement) {
            errorElement = document.createElement("span");
            errorElement.className = this.options.errorMessageClass;
            parent.appendChild(errorElement);
        }

        // Set error message
        errorElement.innerHTML = message;
    };

    HTML5FormValidator.prototype.hideError = function (element) {
        var parent,
            errorElement;

        // Find the parent to later remove the error message to
        if (element.matches('fieldset[required]:enabled input')) {
            parent = findParent(element, this.options.groupParentSelector);
        } else {
            parent = findParent(element, this.options.fieldParentSelector);
        }

        if (parent === null) {
            return;
        }

        errorElement = parent.querySelector('.' + this.options.errorMessageClass);

        // Return when there's no errorElement
        if (!errorElement) {
            return;
        }

        // First, add a '-hide' class
        errorElement.classList.add('-hide');

        // Then remove the element entirely
        setTimeout(function(){
            parent.removeChild(errorElement);
        }, 710);

        parent.classList.remove('-invalid');
    };

    HTML5FormValidator.prototype.showSuccess = function(element) {
        var parent,
            successElement;

        // Find the parent to later append the success element to
        if (element.matches('fieldset[required]:enabled input')) {
            parent = findParent(element, this.options.groupParentSelector);
        } else {
            parent = findParent(element, this.options.fieldParentSelector);
        }

        if (parent === null) {
            return;
        }

        // Find the successElement
        successElement = parent.querySelector('.' + this.options.successMessageClass);

        // Set success class on parent
        parent.classList.add('-success');

        // Check if there is already an error message in the DOM
        if(!successElement) {
            successElement = document.createElement("span");
            successElement.className = this.options.successMessageClass;
            parent.appendChild(successElement);
        }
    };

    HTML5FormValidator.prototype.hideSuccess = function (element) {
        var parent,
            successElement;

        // Find the parent to later remove the success message to
        if (element.matches('fieldset[required]:enabled input')) {
            parent = findParent(element, this.options.groupParentSelector);
        } else {
            parent = findParent(element, this.options.fieldParentSelector);
        }

        if (parent === null) {
            return;
        }

        successElement = parent.querySelector('.' + this.options.successMessageClass);

        // Return when there's no successElement
        if (!successElement) {
            return;
        }

        // First, add a '-hide' class
        successElement.classList.add('-hide');

        // Then remove the element entirely
        setTimeout(function(){
            parent.removeChild(successElement);
        }, 710);

        parent.classList.remove('-success');
    };

    // Pass this object to the window
    window.HTML5FormValidator = HTML5FormValidator;
})();
