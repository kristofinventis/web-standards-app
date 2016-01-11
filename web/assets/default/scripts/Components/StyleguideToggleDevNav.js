define(
    [
        'jquery',
    ],
    function ($) {
        return function(el, config) {
            // el = current DOM el
            // config = Object {foo: "bar"}

            $(el).on('click', function(e) {
                e.preventDefault();
                $('.styleguide__nav-container--developer').toggleClass('styleguide__nav-container--active');
            });

        };
    }
);