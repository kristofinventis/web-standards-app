/* Popup.js */
;(function(){
    var component = document.querySelectorAll('[data-component="Popup"]')

    for (var i = 0; i < component.length; i++) {
        var $el = component[i],
            config = component[i].dataset.config;

        var $popup = document.querySelector('.popup'),
            $popupBg = document.querySelector('.popup-bg'),
            popupId;

        $el.addEventListener('click', function(event) {
            event.preventDefault();
            if (!config) {
                $popup.classList.toggle('-active');
                return;
            }

            var popup = document.querySelector("#"+this.dataset.config);
            popup.classList.toggle('-active');
        });
    }
}());
