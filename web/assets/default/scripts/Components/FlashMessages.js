define(
    [
        'jquery'
    ],
    function ($){
        return function(el, config) {
            // el = current DOM el
            // config = Object {foo: "bar"}
            var $flashContainer = $('.flash-container');

            $(el).on('click', function(e){
                e.preventDefault();
                $flashContainer.addClass('-hide');
                setTimeout(function(){
                    $flashContainer.remove();
                }, 801);
            });
        }
    }
);
