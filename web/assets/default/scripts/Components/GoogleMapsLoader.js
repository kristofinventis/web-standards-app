
/* global require, requireModule */
define(
    [
        'jquery'
    ],
    function ($) {
        "use strict";

        var now = $.now(), promise;

        return function( version, language, apiKey) {

            if( promise ) { return promise; }

            //Create a Deferred Object
            var deferred = $.Deferred(),

                //Declare a resolve function, pass google.maps for the done functions
                resolve = function () {
                    deferred.resolve( window.google && google.maps ? google.maps : false );
                },

                //global callback name
                callbackName = "loadGoogleMaps_" + ( now++ ),

                // Default Parameters
                params = $.extend(
                    {'sensor': false},
                    apiKey ? {"key": apiKey} : {},
                    language ? {"language": language} : {}
                );

            //Ajax URL params
            params = $.extend( params, {
                'v': version || 3,
                'callback': callbackName
            });

            //Declare the global callback
            window[callbackName] = function( ) {

                resolve();

                //Delete callback
                setTimeout(function() {
                    try{
                        delete window[callbackName];
                    } catch( e ) {}
                }, 20);
            };

            //Can't use the jXHR promise because 'script' doesn't support 'callback=?'
            $.ajax({
                dataType: 'script',
                data: params,
                url: '//maps.googleapis.com/maps/api/js'
            });

            promise = deferred.promise();

            return promise;
        };
    }
);
