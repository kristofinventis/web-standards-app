/* Parallax.js */
// define(
//     [
//         'jquery',
//         'Application/Components/SmoothScroll'
//     ],
//     function ($, SmoothScroll) {
//         return function(el, config) {
//             // el = current DOM el
//             // config = Object {foo: "bar"}

//             SmoothScroll();

//             // Set vars
//             var $img = $(el).find('img'),
//                 imgHeight = $img.outerHeight(),
//                 scrollTop = 0,
//                 $inner,
//                 direction,
//                 overflowHeight,
//                 parallaxHeight,
//                 parallaxBottomPos;

//             $(el).append('<span class="parallax__image"></span>');
//             $inner = $(el).find('.parallax__image');

//             // Set config
//             config = $.extend(
//                 {
//                     scrollHeight: 400,
//                     height: 'auto',
//                     direction: 'top'
//                 },
//                 config ? config : {}
//             );

//             overflowHeight = config.scrollHeight; // the height the image will scroll
//             parallaxHeight = (config.height != 'auto' ? config.height : (imgHeight - overflowHeight)); // the max height that the parallax item will have
//             parallaxBottomPos = $(el).offset().top + parallaxHeight;
//             direction = config.direction;

//             if (parallaxHeight <= 0) {
//                 console.log('Image not high enough for parallax effect');
//             }

//             // Setting css of parallax element
//             $(el).css({
//                 'height': parallaxHeight
//             });

//             $inner.css({
//                 'background-image': 'url(' + $img.attr('src') + ')',
//                 'height': imgHeight,
//                 'margin-top': -(imgHeight / 2)
//             });

//             // Hide image
//             $img.css({
//                 'display': 'none'
//             });

//             // scroll effect
//             $(window).scroll(function() {
//                 var toShift = calculateShift() + (overflowHeight/2);
//                 if (direction === 'bottom') {
//                     toShift *= -1;
//                 }
//                 moveImage(toShift);
//             });

//             // Change bg-image position for parallax effect
//             function moveImage(toShift) {
//                 var newPos = 'translateY('+ toShift + 'px)';

//                 $inner.css({
//                     '-webkit-transform': newPos + ' translateZ(0)',
//                     'transform': newPos + ' translateZ(0)'
//                 });
//             }

//             function calculateShift(){
//                 var windowHeight = $(window).outerHeight();
//                 var toShift = ((( parallaxBottomPos - scrollTop  ) / parallaxBottomPos  ) * overflowHeight);
//                 toShift *= -1;
//                 scrollTop = $(window).scrollTop();
//                 return toShift;
//             }

//             scrollTop = $(window).scrollTop();
//             moveImage(calculateShift() + (overflowHeight/2));
//         }
//     }
// );

