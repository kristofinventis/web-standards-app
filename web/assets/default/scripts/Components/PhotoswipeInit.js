/* PhotoswipeInit.js */
;(function(){
    var component = document.querySelectorAll('[data-component="PhotoswipeInit"]')

    // Dependancy
    var script = document.createElement('script');
    script.src = '/assets/default/scripts/vendors/photoswipe/photoswipe.min.js';
    var photoswipe = false;
    script.onload = function () {
        photoswipe = true;
    };

    var scriptExists = isScriptLoaded(script.src);
    if (!scriptExists) {
        document.head.appendChild(script);
    }

    var script = document.createElement('script');
    script.src = '/assets/default/scripts/vendors/photoswipe/photoswipe-ui-default.min.js';
    var photoswipeUI = false;
    script.onload = function () {
        photoswipeUI = true;
        if (photoswipeUI) {
            init();
        }
    };

    var scriptExists = isScriptLoaded(script.src);
    if (!scriptExists) {
        document.head.appendChild(script);
    }

    function init() {
        for (var i = 0; i < component.length; i++) {
            var el = component[i],
                config = component[i].dataset.config;

            var pswpDomEl = document.querySelector('.pswp');
            var items = el.children;
            var slidesArray = new Array();
            var options = {
                index: 0,
                escKey: true
            };

            // Photoswipe needs an array with at least the following items:
            // src: 'path/to/image1.jpg',
            // w: 1024, // image width
            // h: 768, // image height

            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var itemSrc = item.querySelector('a').getAttribute('href'),
                    itemImg = item.querySelector('img').getAttribute('src'),
                    itemSize = item.querySelector('a').dataset.size;

                var slide = {
                    src: itemSrc,
                    w: itemSize.split("x")[0], // split data-size="1024x768" to w and h
                    h: itemSize.split("x")[1],
                    msrc: itemImg
                };

                slidesArray.push(slide);

                item.querySelector('a').addEventListener('click', function(i, event) {
                    event.preventDefault();
                    options.index = i;
                    openPhotoSwipe();
                }.bind(this, i));
            }

            function openPhotoSwipe() {
                var gallery = new PhotoSwipe( pswpDomEl, PhotoSwipeUI_Default, slidesArray, options );
                gallery.init();
            }
        }
    }
}());

