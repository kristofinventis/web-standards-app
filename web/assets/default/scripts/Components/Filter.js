/* Filter.js */
;(function(){
    'use strict';

    var component = document.querySelectorAll('[data-component="Filter"]');

    for (var i = 0; i < component.length; i++) {
        var $el = component[i],
            setup = JSON.parse($el.querySelector('[data-component-config]').innerHTML);

        var state = {
            url           : setup.url,
            renderTo      : setup.renderTo,
            renderToEl    : $el,
            filterOptions : setup.filterOptions || [],

            initialize: function () {
                this.attachListeners();
            },

            attachListeners: function () {
                this.attachFilterableListeners();

                this.renderToEl.querySelector('form').onsubmit = this.onSubmit.bind(this);
            },

            attachFilterableListeners: function () {
                var j,
                    filterables = this.renderToEl.querySelectorAll('.filter__entry input');

                for (j = 0; j < filterables.length; ++j) {
                    filterables[j].addEventListener('change', this.onFilterableChange.bind(this));
                }

                // var filterListItems = this.renderToEl.querySelectorAll('.filter-list__item');
                //
                // for (j = 0; j < filterListItems.length; ++j) {
                //     filterListItems[j].addEventListener('click', function (e) {
                //         // var $el = $(e.target),
                //         //     $filterEl,
                //         //     groupName = $el.data('filter-group-name'),
                //         //     value = $el.data('filter-id');
                //         //
                //         // if (!groupName) {
                //         //     return;
                //         // }
                //         //
                //         //
                //         // $filterEl = this._renderToEl.find('[name="'+ $el.data('filter-group-name') +'[]"][value="' + value +'"]');
                //         // if ($filterEl) {
                //         //     $filterEl[0].checked = false;
                //         //     $filterEl.trigger('change');
                //         // }
                //         //
                //         // $el.remove();
                //     }.bind(this));
                // }
            },

            // getDataAttributeForElement: function(element, name) {
            //     // Support IE 10 and lower (IE 11 doesn't require this anymore).
            //     return (element.dataset !== undefined) ? element.dataset[name] : element.attributes['data-' + name].value;
            // },

            onSubmit: function (e) {
                e.preventDefault();
                e.stopPropagation();

                this.performSubmit();

                return false;
            },

            performSubmit: function () {
                this.renderToEl.querySelector('.results').className += ' -loading';

                var me = this,
                    queryString = this.buildQueryStringFromFilterableValueMap(this.getFilterableValueMap());

                var onLoadCompleted = function () {
                    me.onFormSubmitSuccess(queryString, this.responseText);
                };

                if (this.pendingRequest) {
                    this.pendingRequest.abort();
                }

                var url = this.url + '?' + queryString;

                this.pendingRequest = new XMLHttpRequest();
                this.pendingRequest.open("GET", url);
                this.pendingRequest.onload = onLoadCompleted;
                this.pendingRequest.responseType = 'text';
                this.pendingRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                this.pendingRequest.send();
            },

            buildQueryStringFromFilterableValueMap: function (filterableValueMap) {
                var j,
                    value = null,
                    queryParts = [];

                for (var name in filterableValueMap) {
                    if (filterableValueMap.hasOwnProperty(name)) {
                        value = filterableValueMap[name];

                        if (value.constructor === Array) {
                            for (j = 0; j < value.length; ++j) {
                                if (value[j] !== '') {
                                    queryParts.push(encodeURIComponent(name) + '=' + encodeURIComponent(value[j]));
                                }
                            }
                        } else if (value !== '') {
                            queryParts.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
                        }
                    }
                }

                return queryParts.join('&');
            },

            getFilterableValueMap: function () {
                var map = {},
                    name = null,
                    value = null,
                    filterables = this.renderToEl.querySelectorAll('.filter__entry input');

                for (var j = 0; j < filterables.length; ++j) {
                    name = filterables[j].name;
                    value = this.getValueForFilterable(filterables[j]);

                    if (!map.hasOwnProperty(name)) {
                        map[name] = value;
                    } else if (map[name].constructor === Array) {
                        map[name].push(value);
                    } else {
                        map[name] = [map[name], value];
                    }
                }

                return map;
            },

            getValueForFilterable: function (filterable) {
                if (filterable.type === 'checkbox') {
                    return filterable.checked ? filterable.value : '';
                }

                return filterable.value;
            },

            onFormSubmitSuccess: function (queryString, outputHtml) {
                this.renderToEl.outerHTML = outputHtml;
                this.renderToEl = document.querySelector(this.renderTo);

                if (window.history && history.pushState) {
                    window.history.replaceState(
                        null,
                        null,
                        this.url + (this.url.indexOf('?') !== -1 ? queryString : '?' + queryString)
                    );
                }

                this.attachListeners();
                this.reinitializeComponents();
            },

            reinitializeComponents: function () {
                // Perform reinitialization here, example:
                // window.components.OpenCloseFilter.initializeAll();
                //
                // // Component script is only loaded if there is pagination available.
                // if (window.components.PaginationSelect) {
                //     window.components.PaginationSelect.initializeAll();
                // }
            },

            onFilterableChange: function (e) {
                this.performSubmit();
            }
        };

        state.initialize.call(state);
    }
}());
