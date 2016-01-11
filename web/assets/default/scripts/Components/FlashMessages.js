
/* global define */
define(['jquery'], function ($) {
    "use strict";

    // Closing flash message
    $('.flash-container .alert-message__close').show().on('click', function(e) {
        e.preventDefault();
        $(this).parents('.flash-container').addClass('flash-container--hide').delay(800).queue(function() {
            $(this).remove();
        });
    });

});
