define(
    ['jquery'],
    function ($) {
        $('.accordion__title').on('click', function(e) {
            e.preventDefault();
            var $parent = $(this).parent('.accordion__section');
            var $siblings = $parent.siblings('.accordion__section');

            $parent.toggleClass('accordion__section--active');
            $siblings.removeClass('accordion__section--active');
        });
    }
);