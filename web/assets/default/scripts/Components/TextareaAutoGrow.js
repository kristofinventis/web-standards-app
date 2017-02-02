/* TextareaAutoGrow.js */
;(function(){
    var component = document.querySelectorAll('[data-component="TextareaAutoGrow"]')

    for (var i = 0; i < component.length; i++) {
        var $el = component[i];
        // var config = component[i].dataset.config;

        $el.addEventListener('keyup', function() {
            if (this.scrollHeight > this.clientHeight) {
                this.style.height = this.scrollHeight+5 + 'px';
            }
        });
    }
}());
