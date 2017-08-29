/* FormValidator.js */
;(function(){
    var component = document.querySelectorAll('[data-component="FormValidator"]')

    var isHtml5FormValidatorLoaded = false;
    var isPasswordStrengthCalculatorScriptLoaded = false;

    // Dependancy
    var script = document.createElement('script');
    script.src = '/assets/default/scripts/HTML5FormValidator.js';
    script.onload = function () {
        isHtml5FormValidatorLoaded = true;

        if (isPasswordStrengthCalculatorScriptLoaded) {
            init();
        }
    };

    document.head.appendChild(script);

    var script = document.createElement('script');
    script.src = '/assets/default/scripts/PasswordStrengthCalculator.js';
    script.onload = function () {
        isPasswordStrengthCalculatorScriptLoaded = true;

        if (isHtml5FormValidatorLoaded) {
            init();
        }
    };

    document.head.appendChild(script);

    function init(){
        for (var i = 0; i < component.length; i++) {
            var $el = component[i];
            var fields = $el.querySelectorAll('input, textarea, select');
            var submitButton = $el.querySelector('[type=submit]');

            for (var j = 0; j < fields.length; j++) {
                if (fields[j].type === "password" && fields[j].required === true && fields[j].dataset.validation !== "false") {
                    fields[j].addEventListener('keyup', function(){
                        // Validate this field
                        // and pass translations for validator message
                        var validate = new HTML5FormValidator(this, {messages: formvalidator_translations, showSuccess: true});
                    });
                } else if (fields[j].type === "password" && fields[j].required === false && fields[j].dataset.validation !== "false") {
                    fields[j].addEventListener('keyup', function(){
                        var validate = new PasswordStrengthCalculator(this, {passwordTier: password_strength_translations});
                    });
                } else {
                    fields[j].addEventListener('blur', function(){
                        var validate = new HTML5FormValidator(this, {messages: formvalidator_translations, showSuccess: true});
                    });
                }
            }

            // Validate form on submit
            submitButton.addEventListener('click', function(fields, $el, e){
                var formIsValid = true;

                // Loop each field
                for (var j = 0; j < fields.length; j++) {
                    // Pass translations for validator message
                    var field = new HTML5FormValidator(fields[j], {messages: formvalidator_translations, showSuccess: true});
                    if(!field.isValid) {
                        formIsValid = false;
                    }
                }

                if (!formIsValid) {
                    e.preventDefault();
                    $el.querySelector('.-invalid').querySelector('input, textarea, select').focus();
                }
            }.bind(this, fields, $el));
        }
    }
}());
