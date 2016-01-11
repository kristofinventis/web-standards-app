
/* global require, define */
define(['jquery'], function ($) {
    "use strict";

    // This require forces magnificPopup to be loaded after $ is available
    require(['magnificPopup'], function() {
        // Translations
        $.extend(true, $.magnificPopup.defaults, lightbox_translations);

        // Lightbox
        if ($('a.lightbox').length) {
            $('a.lightbox').magnificPopup({
                type:'image',
                iframe: {
                    patterns: {
                        youtube: {
                            index: 'youtube.com/', // String that detects type of video (in this case YouTube). Simply via url.indexOf(index).

                            id: 'v=', // String that splits URL in a two parts, second part should be %id%
                            // Or null - full URL will be returned
                            // Or a function that should return %id%, for example:
                            // id: function(url) { return 'parsed id'; }

                            src: '//www.youtube.com/embed/%id%?autoplay=1' // URL that will be set as a source for iframe.
                        },
                        vimeo: {
                            index: 'vimeo.com/',
                            id: '/',
                            src: '//player.vimeo.com/video/%id%?autoplay=1'
                        },
                        gmaps: {
                            index: '//maps.google.',
                            src: '%id%&output=embed'
                        }
                    },

                    srcAction: 'iframe_src' // Templating object key. First part defines CSS selector, second attribute. "iframe_src" means: find "iframe" and set attribute "src".
                }
            });
        }

        // Lightbox gallery
        $('.lightbox-gallery, .media-grid').each(function() { // the containers for all your galleries should have the class gallery
            $(this).magnificPopup({
                delegate: 'a', // the container for each your gallery items
                type: 'image',
                gallery:{enabled:true}
            });
        });
    });

});
