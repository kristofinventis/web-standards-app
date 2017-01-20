define(
    [
        'jquery',
    ],
    function ($) {
        return function(el, config) {
            var submitOnChange = $(el).data('submit-on-change');
            var $select__label = $(el).find('.select__label');
            var $select__input = $(el).find('.select__input');

            var updateValues = function() {
                selectedValue = $(el).find('option:selected').val();

                var selectedText = $(el).find('option:selected').text();

                $select__label.html(selectedText);
            };

            var onFieldChange = function () {
                updateValues();

                if (submitOnChange == '1') {
                    $select__input.closest('form').submit();
                }
            };

            $select__input.on('change', onFieldChange);

            updateValues();
        }
    }
);
