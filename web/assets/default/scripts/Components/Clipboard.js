/* Clipboard.js */
// define(
//     [
//         'jquery'
//     ],
//     function ($) {
//         return function(el, config) {

//             var className = el.className;
//             var clipboard = new Clipboard(el);

//             clipboard.on('success', function(e) {
//                 $(e.trigger).addClass('tooltip--success');

//                 setTimeout(function () {
//                   $(e.trigger).removeClass('tooltip--success');
//                 }, 2900);

//                 e.clearSelection();
//             });

//             clipboard.on('error', function(e) {
//                 $(e.trigger).addClass('tooltip--error');

//                 setTimeout(function () {
//                   $(e.trigger).removeClass('tooltip--error');
//                 }, 2900);
//             });

//         }
//     }
// );
