define(
    [
        'jquery',
        'picker',
        'pickatime'
    ],
    function ($) {
        return function(el, config) {
            // el = current DOM el
            // config = Object {foo: "bar"}

            $(el).pickatime();

        };
    }
);