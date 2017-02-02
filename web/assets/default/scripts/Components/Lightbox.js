/* Lightbox.js */
;(function(){
    var component = document.querySelectorAll('[data-component="Lightbox"]')

    // Dependancy
    var script = document.createElement('script');
    script.src = './assets/default/scripts/vendors/jsonlylightbox/lightbox.min.js';
    script.onload = function () {
        console.log('loaded');
        start();
    };

    document.head.appendChild(script);

    function start(){
        for (var i = 0; i < component.length; i++) {
            //var $el = component[i];

            var lightbox = new Lightbox();

            // options
            // all options at: https://github.com/felixhagspiel/jsOnlyLightbox
            var lightBoxOptions = {
                // boxId: false,
                // dimensions: true,
                // captions: true,
                // prevImg: false,
                // nextImg: false,
                // hideCloseBtn: false,
                // closeOnClick: true,
                // loadingAnimation: 200,
                // animElCount: 4,
                // preload: true,
                // carousel: true,
                // animation: 400,
                // nextOnClick: true,
                // responsive: true,
                // maxImgSize: 0.8,
                // keyControl: true,
                // // callbacks
                // onopen: function(){
                // // ...
                // },
                // onclose: function(){
                // // ...
                // },
                // onload: function(event){
                // // ...
                // },
                // onresize: function(){
                // // ...
                // }
                // onloaderror: function(event){
                // // ...
                // }
            }

            lightbox.load();
        }
    }
}());
