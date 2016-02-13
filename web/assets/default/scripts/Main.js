/* Main script */
require(
    [
        'jquery',
        'Application/Manager',
        'Application/Components/FormValidator',
        'Application/Components/Lightbox',
        'Application/Components/FlashMessages',
        'Application/Components/TextareaAutoGrow',
        'Application/Components/Placeholder',
        requireModule
    ],
    function ($, Manager, FormValidator) {
        'use strict';

        new FormValidator(
            $('form')[0],
            {
                fields: {
                    firstname: ['required', ['max-length', {length: 100}]]
                }
            }
        );
    }
);
