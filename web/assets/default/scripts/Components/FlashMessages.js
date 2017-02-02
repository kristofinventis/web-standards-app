/* FlashMessages.js */
;(function(){
    Element.prototype.remove = function() {
        this.parentElement.removeChild(this);
    }

    NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
        for(var i = this.length - 1; i >= 0; i--) {
            if(this[i] && this[i].parentElement) {
                this[i].parentElement.removeChild(this[i]);
            }
        }
    }

    var component = document.querySelectorAll('[data-component="FlashMessages"]')

    for (var i = 0; i < component.length; i++) {
        var $el = component[i];

        var $flashContainer = document.querySelector('.flash-container');
        $el.addEventListener('click', function(event) {
            event.preventDefault();
            $flashContainer.classList.add('-hide');

            setTimeout(function(){
                $flashContainer.remove();
            }, 801);

        });
    }
}());
