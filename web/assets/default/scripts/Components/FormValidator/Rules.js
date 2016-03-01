define(
    ['Application/Components/FormValidator/Rule'],
    function (Rule) {
        "use strict";

        var validationMessages = {
            REQUIRED: 'Dit veld is verplicht in the vullen',
            MAXLENGTH: 'Dit veld mag max {0} karakters bevatten'
        };

        var Collection = function () {
            this.list = []
        };
        Collection.prototype.add = function (rule) {
            this.list.push(rule);
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
            function (value) {
                return value.length > 0;
            },
            validationMessages.REQUIRED
        ));

        Rules.add(new Rule(
            'max-length',
            function (value, options) {
                return value.length < options.length;
            },
            function (value, options) {
                return validationMessages.MAXLENGTH.replace('{0}', options.length);
            }
        ));

        return Rules;
    }
);