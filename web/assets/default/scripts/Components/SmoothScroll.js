// define(
//     [
//         'jquery',
//         'TweenMax',
//         'ScrollToPlugin'
//     ],
//     function ($, TweenMax, ScrollToPlugin) {
//         return function(el, config) {
//             // el = current DOM el
//             // config = Object {foo: "bar"}

//             var $window = $(window),
//                 scrollTime = 0.4,
//                 scrollDistance = 150;

//             $window.on("mousewheel DOMMouseScroll", function(event){

//                 event.preventDefault();

//                 var delta = event.originalEvent.wheelDelta/120 || -event.originalEvent.detail/3,
//                     scrollTop = $window.scrollTop(),
//                     finalScroll = scrollTop - parseInt(delta*scrollDistance);

//                 TweenMax.to(
//                     $window,
//                     scrollTime,
//                     {
//                         scrollTo : { y: finalScroll, autoKill:true },
//                         ease: Power1.easeOut,
//                         overwrite: 5
//                     }
//                 );

//             });

//         }
//     }
// );

