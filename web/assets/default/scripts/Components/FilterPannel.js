define(
    [
        'jquery',
    ],
    function ($) {
        return function(el, config) {
            // el = current DOM el
            // config = Object {foo: "bar"}


            var $trigger = $(el).find('.filter__pannel-title');
            var $content = $(el).find('.filter__pannel-content');
            var $inner = $(el).find('.filter__pannel-inner');
            var height = 0;
            var open = false;

            // Set height
            $content.css({"height": height});


            // Toggle on click
            $trigger.on('click', function(e){
                e.preventDefault();

                // Toggle title
                $trigger.toggleClass('filter__pannel-title--open');


                if(!open) {
                    // OPENING
                    open = true;

                    $content.css({"height": $inner.outerHeight(true)});
                    $content.addClass('filter__pannel-content--transitioning');

                    setTimeout(function(){
                        $content.removeClass('filter__pannel-content--transitioning');
                        $content.addClass('filter__pannel-content--open');
                        $content.css({"height": "auto"});
                    }, 350);

                } else {
                    // CLOSING
                    open = false;

                    $content.css({"height": $inner.outerHeight(true)});

                    setTimeout(function(){
                        $content.addClass('filter__pannel-content--transitioning');
                        $content.removeClass('filter__pannel-content--open');
                    }, 10);

                    setTimeout(function(){
                        $content.css({"height": 0});
                    }, 10);

                    setTimeout(function(){
                        $content.removeClass('filter__pannel-content--transitioning');
                    }, 350);

                };

            });
        };
    }
);