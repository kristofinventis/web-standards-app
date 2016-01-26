define(
    [
        'jquery',
    ],
    function ($) {
        return function(el, config) {
            // el = current DOM el
            // config = Object {foo: "bar"}

            var url = window.location;
            var hash = window.location.hash;
            var param = url.pathname + url.search;

            $(el).find('.styleguide__nav-list__link').each(function(){
                var href = $(this).attr('href');
                if (href == param.slice(1)) {
                    $(this).addClass('styleguide__nav-list__link--current');
                }
                $(this).on('click', function(e){
                    scrollto(e, $(this));
                })
            });

            $(el).find('a[href="'+hash+'"]').addClass('styleguide__list-item--same-hash');

            $(window).on('hashchange', function() {
                hash = window.location.hash;
                $(el).find('.styleguide__list-item--same-hash').removeClass('styleguide__list-item--same-hash');
                $(el).find('a[href="'+hash+'"]').addClass('styleguide__list-item--same-hash');
            });


            function scrollto(e, link) {
                // e.preventDefault();

                // var currentUrl = ''+url;

                // if(history.pushState) {
                //     history.pushState(null, null, $(link).attr('href'));
                // } else {
                //     location.hash = $(link).attr('href');
                // }

                // url = window.location;

                // console.log(''+ currentUrl);
                // console.log(''+ url);

                // if (currentUrl != (''+url)) {
                //     location = url;
                // }

                // var href = $(link).attr('href').slice(1);
                // var pos = 0;

                // if ( $("a[name='"+href+"'").length ) {
                //     pos = $("a[name='"+href+"'").position().top;
                // }



                // $('html, body').animate({scrollTop: pos}, 400)

            };

        };
    }
);