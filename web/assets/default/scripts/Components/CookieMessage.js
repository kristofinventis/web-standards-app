/* CookieMessage.js */
;(function(){
    var component = document.querySelectorAll('[data-component="CookieMessage"]')

    for (var i = 0; i < component.length; i++) {
        var el = component[i],
            config = component[i].dataset.config;

        el.addEventListener('click', function(event) {
            event.preventDefault();

            var cookieBox = this.parentNode;
            cookieBox.classList.toggle('-hide');

            window.setTimeout(function(e){
                cookieBox.remove();
            }, 400);
        });
    }
}());
