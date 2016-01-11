
/* global require, define */
require(['jquery'], function ($) {
    "use strict";

    // This require forces placeholder to be loaded after $ is available
    require(['html5validator'], function() {
        $('form').not('.no-js-validation').html5validator({
            messages: formvalidator_translations
        });
    });
});
