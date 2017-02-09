/* FormValidator.js */
;(function(){
    var component = document.querySelectorAll('[data-component="FormValidator"]')

    // Dependancy
    var script = document.createElement('script');
    script.src = './assets/default/scripts/HTML5FormValidator.js';
    script.onload = function () {
        init();
    };

    document.head.appendChild(script);

    var script = document.createElement('script');
    script.src = './assets/default/scripts/PasswordStrengthCalculator.js';
    script.onload = function () {
        init();
    };

    document.head.appendChild(script);

    function init(){
        for (var i = 0; i < component.length; i++) {
            var $el = component[i];
            var fields = document.querySelectorAll('input, textarea, select');
            var submitButton = $el.querySelector('[type=submit]');

            for (var i = 0; i < fields.length; i++) {
                if (fields[i].type === "password" && fields[i].required === true) {
                    fields[i].addEventListener('keyup', function(){
                        // Validate this field
                        // and pass translations for validator message
                        var validate = new HTML5FormValidator(this, {messages: formvalidator_translations, showSuccess: true});
                    });
                } else if (fields[i].type === "password" && fields[i].required === false) {
                    fields[i].addEventListener('keyup', function(){
                        var validate = new PasswordStrengthCalculator(this, {passwordTier: password_strength_translations});
                    });
                } else {
                    fields[i].addEventListener('blur', function(){
                        var validate = new HTML5FormValidator(this, {messages: formvalidator_translations, showSuccess: true});
                    });
                }
            }

            // Validate form on submit
            submitButton.addEventListener('click', function(e){
                var formIsValid = true;

                // Loop each field
                for (var i = 0; i < fields.length; i++) {
                    // Pass translations for validator message
                    var field = new HTML5FormValidator(fields[i], {messages: formvalidator_translations, showSuccess: true});
                    if(!field.isValid) {
                        formIsValid = false;
                    }
                }

                if (!formIsValid) {
                    e.preventDefault();
                    document.querySelector('.-invalid').querySelector('input, textarea, select').focus();
                }
            });
        }
    }
}());
