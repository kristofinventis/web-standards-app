define(
    [
        'jquery',
        'highlight',
    ],
    function ($) {
        return function(el, config) {
            // el = current DOM el
            // config = Object {foo: "bar"}

            var button = '.button--copy';
            var $button = $(el).find('.button--copy');

            $(document).ready(function() {
                $(el).each(function(i, block) {
                  hljs.highlightBlock(block);
                });
            });

            var clipboard = new Clipboard(button, {
                target: function(trigger) {
                    return trigger.nextElementSibling;
                }
            });

            clipboard.on('success', function(e) {
                $(e.trigger).addClass('tooltip--success');

                setTimeout(function () {
                  $(e.trigger).removeClass('tooltip--success');
                }, 2900);

                e.clearSelection();
            });

            clipboard.on('error', function(e) {
                $(e.trigger).addClass('tooltip--error');

                setTimeout(function () {
                  $(e.trigger).removeClass('tooltip--error');
                }, 2900);
            });

        }
    }
);
