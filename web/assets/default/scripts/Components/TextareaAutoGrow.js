
/* global define */
define(['jquery'], function ($) {
    "use strict";

    // Auto grow textareas
    $('textarea').on('keyup', function(e){
        if (this.scrollHeight > this.clientHeight) {
            this.style.height = this.scrollHeight+5 + 'px';
        }
    });

});
