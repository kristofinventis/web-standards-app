define(
    ['jquery'],
    function ($) {
        $('[data-component]').each(function() {
            var el = this,
                $componentData = $(el),
                $componentDataConfig;

            require([$componentData.data('component')], function(Component) {
                if (($componentDataConfig = $componentData.find('[data-component-config]')) && $componentDataConfig.length) {
                    new Component(el, JSON.parse($componentDataConfig.html()));
                } else {
                    new Component(el);
                }
            });
        });
    }
);
