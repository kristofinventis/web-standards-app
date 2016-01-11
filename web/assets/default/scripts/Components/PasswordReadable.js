
define(['jquery'], function ($) {
    "use strict";
    
    $('input[name="pass_readable"]').change(function(){
        var target = $('#'+$(this).attr('rel'));
        var type = "password";

        if ($(this).prop("checked")) {
            type = "text";
        }

        // Internet explorer doesn't allow changing of the type property
        // for input fields. To work around this, we have to replace the
        // the input field with another one. Just cloning the old object
        // and then changing the type property doesn't work either.
        // The properties in the following array will be copied
        var replaceProperties = ['id', 'class', 'name', 'value'];
        // Create new field with the correct type
        var newField = $('<input type="' + type + '">');
        // Copy property values
        for(var i = 0; i < replaceProperties.length; i++) {
            newField.attr(replaceProperties[i], target.prop(replaceProperties[i]));
        }
        // Replace the field
        target.replaceWith(newField);
    });
});
