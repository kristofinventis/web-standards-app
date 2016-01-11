define(
    ['jquery'],
    function ($) {
        var $nav = $('.nav-main');
        var $button = $('.masthead__menu-button');

        $button.on('click', function(e) {
            e.preventDefault();
            $nav.toggleClass('nav-main--active');
        });
    }
);