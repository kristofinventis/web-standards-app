/* Select.js */
;(function(){
    var component = document.querySelectorAll('[data-component="Select"]')

    for (var i = 0; i < component.length; i++) {

        var $select = component[i];
        var submitOnChange = $select.dataset.submitOnChange;
        var $select__label = $select.querySelector('.select__label');
        var $select__input = $select.querySelector('.select__input');

        var updateValues = function() {
            selectedValue = $select__input.options[$select__input.selectedIndex].value;
            var selectedText = $select__input.options[$select__input.selectedIndex].text;
            $select__label.innerHTML = selectedText;
        };

        var onFieldChange = function () {
            updateValues();

            if (submitOnChange == '1') {
                $select__input.closest('form').submit();
            }
        };

        // $select__input.on('change', onFieldChange);
        $select__input.addEventListener('change', onFieldChange);

        updateValues();
    }
}());
