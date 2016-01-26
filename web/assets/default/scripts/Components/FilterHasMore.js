define(
    [
        'jquery',
    ],
    function ($) {
        return function(el, config) {
            // el = current DOM el
            // config = Object {foo: "bar"}

            var $trigger = $(el).find('.filter__has-more__trigger');
            var $content = $(el).find('.filter__has-more__items');
            var $inner = $(el).find('.filter__has-more__inner');
            var height = 0;

            $trigger.on('click', function(e){
                e.preventDefault();

                // Toggle between 0 and complete height of inner element
                height = ( height > 0 ? 0 : $inner.outerHeight(true) );
                $content.css({"max-height": height});

                // Toggle open/close classes
                $trigger.toggleClass('filter__has-more__trigger--open');
                $content.toggleClass('filter__has-more__items--visible');
            });

        };
    }
);