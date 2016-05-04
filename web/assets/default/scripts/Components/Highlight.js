define(
    [
        'jquery',
        'Application/Components/Highlight.pack',
    ],
    function ($) {
        return function(el, config) {

            $(document).ready(function() {
                $(el).each(function(i, block) {
                  hljs.highlightBlock(block);
                });
            });
        }
    }
);