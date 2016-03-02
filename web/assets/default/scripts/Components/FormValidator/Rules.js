define(
    ['Application/Components/FormValidator/Rule'],
    function (Rule) {
        "use strict";

        var validationMessages = {
            REQUIRED: 'Dit veld is verplicht in the vullen',
            EMAIL: 'Dit is geen geldig e-mailadres',
            MAXLENGTH: 'Dit veld mag max {0} karakters bevatten'
        };

        var Collection = function () {
            this.list = [];
            this.length = 0;
        };
        Collection.prototype.add = function (rule) {
            this.list.push(rule);
            this.length = this.list.length;
        };
        Collection.prototype.find = function (name) {
            var i = 0, length = this.list.length;
            for (i=0; i<length; i++) {
                if (this.list[i].getName() == name) {
                    return this.list[i];
                }
            }

            return false;
        };

        var Rules = new Collection();
        Rules.add(new Rule(
            'required',
            function (element) {
                if (element.type == 'checkbox') {
                    return element.checked;
                }
                return element.value.length > 0;
            },
            validationMessages.REQUIRED,
            '[required]'
        ));

        var emailRegEx = /^([\w-\.\+]+@([\w-]+\.)+[\w-]{2,4})?$/;
        Rules.add(new Rule(
            'email',
            function (element) {
                return emailRegEx.test(element.value);
            },
            validationMessages.EMAIL,
            '[type=email]'
        ));

        Rules.add(new Rule(
            'max-length',
            function (element, options) {
                var maxlength = options ? option.length : element.attributes.maxlength.value;
                return element.value.length <= maxlength;
            },
            function (element, options) {
                var maxlength = options ? option.length : element.attributes.maxlength.value;
                return validationMessages.MAXLENGTH.replace('{0}', maxlength);
            },
            '[maxlength]'
        ));

        return Rules;
    }
);