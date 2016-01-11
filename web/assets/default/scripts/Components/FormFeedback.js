/*!
 * FormFeedback.js
 * Checks if a form is valid and disables the submitbutton on submit, so the user gets some feedback that his form was submitted.
 * This also ensures that there won't be multiple form submissions.
 */
define(
    ['jquery'],
    function ($) {
        if (typeof document.createElement('input').checkValidity != 'function') {
            return;
        }

        // Handle double submits on forms by checking their validity and disabling the button when validation passes.
        $('form').on('submit', function (e) {
            if (this.checkValidity()) {
                $('.button--loading', this).attr('disabled', 'disabled');
            } else {
                e.preventDefault();
            }
        });
    }
);