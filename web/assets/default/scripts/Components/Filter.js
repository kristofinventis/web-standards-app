define(
    [
        'Inventis/Class',
        'jquery'
    ],
    function (Class, $) {
        'use strict';

        var historyApiAvailable = (window.history && history.pushState);

        return Class.extend({
            _renderTo: null,
            _renderToEl: null,
            _url: null,
            _filterOptions: null,
            _xhr: null,

            FIELDSET_IS_OPEN: 1,
            FIELDSET_SHOW_ALL: 2,

            __construct: function(el, setup) {
                this._renderTo = setup.renderTo;
                this._renderToEl = $(el);
                this._url = setup.url;
                this._filterOptions = setup.filterOptions || [];
                this._attachListeners();
            },

            _attachListeners: function() {
                this._attachFilterListeners();

                if (!historyApiAvailable) {
                    return;
                }

                this._renderToEl
                    .find('form.filter')
                    .on('submit', this.onFilterFormSubmit.bind(this));
            },

            _attachFilterListeners: function() {
                this._renderToEl
                    .find('.filterable input')
                    .on('change', this.onFilterableChange.bind(this));

                /*
                var $sortSelect = $('#frm_sort'),
                    $sort = this._renderToEl.find('input[name=sort]'),
                    $dir = this._renderToEl.find('input[name=dir]');

                $sortSelect.on('change', function(e) {
                    e.preventDefault();
                    switch (e.target.value) {
                        case 'bestsellers':
                            $sort.val('bestsellers');
                            $dir.val('asc');
                            break;
                        case 'price_asc':
                            $sort.val('price');
                            $dir.val('asc');
                            break;
                        case 'price_desc':
                            $sort.val('price');
                            $dir.val('desc');
                            break;
                        case 'score':
                            $sort.val('score');
                            $dir.val('desc');
                            break;
                    }
                    $sort.parents('form').submit();
                }.bind(this));
                */

                this._renderToEl.find('.filter-list__item').on('click', function(e) {
                    var $el = $(e.target),
                        $filterEl,
                        groupName = $el.data('filter-group-name'),
                        value = $el.data('filter-id');

                    if (!groupName) {
                        return;
                    }

                    if (groupName == 'price' || groupName == 'alcpct') {
                        $filterEl = this._renderToEl.find('[name="' + groupName + '_' + value + '"]');
                        if ($filterEl) {
                            $filterEl
                                .val('')
                                .trigger('change');
                        }
                    } else {
                        $filterEl = this._renderToEl.find('[name="'+ $el.data('filter-group-name') +'[]"][value="' + value +'"]');
                        if ($filterEl) {
                            $filterEl[0].checked = false;
                            $filterEl.trigger('change');
                        }
                    }

                    $el.remove();
                }.bind(this));
            },

            onFilterFormSubmit: function(e) {
                e.preventDefault();
                var formData = $(e.target).serializeArray(),
                    historyData = $(e.target).serialize();

                $('.filter-results').addClass('helpers--is-loading');

                if (this._xhr) {
                    this._xhr.abort();
                }
                this._xhr = $.get(this._url, formData, this.onFormSubmitSuccess.bind(this, historyData), 'html');
            },

            onFormSubmitSuccess: function(formData, data, textStatus, jqXHR) {
                this._renderToEl = this._renderToEl.replaceWith(data);
                this._renderToEl = $(this._renderTo);
                window.history.replaceState(
                    null,
                    null,
                    this._url + (this._url.indexOf('?') !== -1 ? formData : '?' + formData)
                );
                this._attachListeners();
            },

            onFilterableChange: function(e) {
                $(e.target.form).submit();
            }
        });
    }
);
