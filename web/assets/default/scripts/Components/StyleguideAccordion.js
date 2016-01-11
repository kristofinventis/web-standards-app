define(
    [
        'jquery',
    ],
    function ($) {
        return function(el, config) {
            // el = current DOM el
            // config = Object {foo: "bar"}

            var $trigger = $(el).find('.styleguide__accordion__header');

            $(document).ready(function() {
                $trigger.on('click', function(e) {
                    e.preventDefault();
                    $(el).toggleClass('styleguide__accordion--active');
                });
            });
        }
    }
);