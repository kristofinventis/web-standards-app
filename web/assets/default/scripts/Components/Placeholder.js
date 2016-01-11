
/* global require, define */
define(['jquery'], function ($) {
    "use strict";

    // This require forces placeholder to be loaded after $ is available
    require(['placeholder'], function() {
        $('input, textarea').placeholder();
    });

});
