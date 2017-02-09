/* ShowHidePassword.js */
;(function(){
    var component = document.querySelectorAll('[data-component="ShowHidePassword"]')

    for (var i = 0; i < component.length; i++) {
        var el = component[i];
        var passwordField = el.parentElement.querySelector('input[type=password]');

        el.addEventListener('click', function(e){
            e.preventDefault();

            if (passwordField.type === "text") {
                passwordField.type = "password";
            } else {
                passwordField.type = "text";
            }
        });

    }
}());
