define(
    [
        'jquery',
    ],
    function ($) {
        return function(el, config) {
            // el = current DOM el
            // config = Object {foo: "bar"}

            if (config == undefined) {
                var $popup = $('.popup');
                var $popupBg = $('.popup-bg');

                $(el).on('click', function(e){
                    e.preventDefault();

                    if (!$popup.hasClass('-active')) {
                        $popup.toggleClass('-active');
                        $popupBg.toggleClass('-active');
                    } else {
                        $popup.toggleClass('-active');
                        $popupBg.toggleClass('-active');
                    }
                });
            } else {
                $(el).on('click', function(e){
                    e.preventDefault();
                    $('#'+config.popupId).toggleClass('-active');
                    $popupBg.toggleClass('-active');
                });
            }

        };
    }
);
