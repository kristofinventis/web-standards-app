/* global require, define */
define(
    [
        'jquery',
        'Application/Components/FormValidator',
        'Application/Components/FormValidator/Rules'
    ],
    function ($, FormValidator, Rules) {
        "use strict";

        new FormValidator(
            $('form')[0],
            {
                /*fields: {
                 firstname: ['required', ['max-length', {length: 100}]]
                 }*/
            },
            Rules
        );
    }
);
