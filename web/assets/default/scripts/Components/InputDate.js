define(
    [
        'jquery',
        'picker',
        'pickadate'
    ],
    function ($) {
        return function(el, config) {
            // el = current DOM el
            // config = Object {foo: "bar"}

            $(el).pickadate();

        };
    }
);