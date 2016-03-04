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
                $('.nav-container--developer').toggleClass('nav-container--active');
            });

        };
    }
);